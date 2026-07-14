package com.ticketverse.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketverse.entity.Seat;
import com.ticketverse.event.*;
import com.ticketverse.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import jakarta.annotation.PostConstruct;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaWebSocketConsumer {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;
    private final SeatRepository seatRepository;
    private final MeterRegistry meterRegistry;
    
    private Counter broadcastRateCounter;

    @PostConstruct
    public void initMetrics() {
        this.broadcastRateCounter = meterRegistry.counter("business.websocket.broadcast.total");
    }

    @KafkaListener(topics = "seat-events-topic", groupId = "event-service-group")
    public void consumeSeatEvent(String message) {
        try {
            // Because SeatLockedEvent and SeatUnlockedEvent have different payloads, we can parse as generic Map or peek at eventType.
            // But DomainEvent carries the eventType. We can parse it as a tree first.
            com.fasterxml.jackson.databind.JsonNode rootNode = objectMapper.readTree(message);
            String eventType = rootNode.get("eventType").asText();

            if ("SEAT_LOCKED".equals(eventType)) {
                DomainEvent<SeatLockedPayload> event = objectMapper.readValue(message, new TypeReference<>() {});
                SeatLockedPayload payload = event.getPayload();
                
                // Broadcast to WebSockets
                String destination = "/topic/events/" + payload.getEventId() + "/seats";
                messagingTemplate.convertAndSend(destination, event);
                broadcastRateCounter.increment();
                log.info("Broadcasted SEAT_LOCKED for seat {} to {}", payload.getSeatId(), destination);
                
            } else if ("SEAT_UNLOCKED".equals(eventType)) {
                DomainEvent<SeatUnlockedPayload> event = objectMapper.readValue(message, new TypeReference<>() {});
                SeatUnlockedPayload payload = event.getPayload();
                
                // Broadcast to WebSockets
                String destination = "/topic/events/" + payload.getEventId() + "/seats";
                messagingTemplate.convertAndSend(destination, event);
                broadcastRateCounter.increment();
                log.info("Broadcasted SEAT_UNLOCKED for seat {} to {}", payload.getSeatId(), destination);
            }
        } catch (Exception e) {
            log.error("Failed to process seat-events-topic message: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(topics = "booking-created-topic", groupId = "event-service-group")
    @Transactional
    public void consumeBookingCreatedEvent(String message) {
        try {
            com.fasterxml.jackson.databind.JsonNode rootNode = objectMapper.readTree(message);
            String eventType = rootNode.get("eventType").asText();

            if ("BOOKING_CREATED".equals(eventType)) {
                DomainEvent<BookingCreatedPayload> event = objectMapper.readValue(message, new TypeReference<>() {});
                BookingCreatedPayload payload = event.getPayload();
                
                // 1. Update DB (replacing the synchronous REST call from BookingService)
                List<Seat> seats = seatRepository.findAllById(payload.getSeatIds());
                for (Seat seat : seats) {
                    seat.setStatus("BOOKED");
                    seat.setBookingId(payload.getBookingId());
                }
                seatRepository.saveAll(seats);
                
                // 2. Broadcast SeatBookedEvent for each seat
                for (Long seatId : payload.getSeatIds()) {
                    DomainEvent<SeatBookedEvent> wsEvent = DomainEvent.create(
                            "SEAT_BOOKED", 
                            event.getCorrelationId(), 
                            "ticketverse-event-service", 
                            new SeatBookedEvent(payload.getEventId(), seatId, payload.getBookingId()), 
                            null
                    );
                    String destination = "/topic/events/" + payload.getEventId() + "/seats";
                    messagingTemplate.convertAndSend(destination, wsEvent);
                    broadcastRateCounter.increment();
                }
                log.info("Processed BOOKING_CREATED and broadcasted SEAT_BOOKED for booking {}", payload.getBookingId());

            } else if ("BOOKING_CANCELLED".equals(eventType)) {
                DomainEvent<BookingCancelledPayload> event = objectMapper.readValue(message, new TypeReference<>() {});
                BookingCancelledPayload payload = event.getPayload();
                
                // Update DB to AVAILABLE
                List<Seat> seats = seatRepository.findByBookingId(payload.getBookingId());
                for (Seat seat : seats) {
                    seat.setStatus("AVAILABLE");
                    seat.setBookingId(null);
                    
                    // Broadcast SeatUnlockedEvent
                    DomainEvent<SeatUnlockedPayload> wsEvent = DomainEvent.create(
                            "SEAT_UNLOCKED", 
                            event.getCorrelationId(), 
                            "ticketverse-event-service", 
                            new SeatUnlockedPayload(payload.getEventId(), seat.getId()), 
                            null
                    );
                    String destination = "/topic/events/" + payload.getEventId() + "/seats";
                    messagingTemplate.convertAndSend(destination, wsEvent);
                    broadcastRateCounter.increment();
                }
                seatRepository.saveAll(seats);
                log.info("Processed BOOKING_CANCELLED and freed seats for booking {}", payload.getBookingId());
            }

        } catch (Exception e) {
            log.error("Failed to process booking-created-topic message: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(topics = "dashboard-metrics-topic", groupId = "event-service-group")
    public void consumeDashboardMetrics(String message) {
        try {
            DomainEvent<DashboardMetricsPayload> event = objectMapper.readValue(message, new TypeReference<>() {});
            messagingTemplate.convertAndSend("/topic/dashboard", event);
            broadcastRateCounter.increment();
            log.debug("Broadcasted DASHBOARD_METRICS_UPDATED");
        } catch (Exception e) {
            log.error("Failed to process dashboard-metrics-topic message: {}", e.getMessage(), e);
        }
    }

    public record SeatBookedEvent(Long eventId, Long seatId, Long bookingId) {}
}
