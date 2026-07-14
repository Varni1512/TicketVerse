package com.ticketverse.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketverse.entity.AnalyticsRecord;
import com.ticketverse.entity.ProcessedEvent;
import com.ticketverse.event.BookingCreatedPayload;
import com.ticketverse.event.DomainEvent;
import com.ticketverse.repository.AnalyticsRecordRepository;
import com.ticketverse.repository.ProcessedEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ProcessedEventRepository processedEventRepository;
    private final AnalyticsRecordRepository analyticsRecordRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "booking-created-topic", groupId = "analytics-group")
    @Transactional
    public void consumeBookingCreatedEvent(String message) {
        try {
            DomainEvent<BookingCreatedPayload> event = objectMapper.readValue(message, new TypeReference<>() {});
            
            log.info("Analytics received BookingCreatedEvent: correlationId={}", event.getCorrelationId());
            org.slf4j.MDC.put("correlationId", event.getCorrelationId());

            // 1. Idempotency Check
            Optional<ProcessedEvent> existingEvent = processedEventRepository.findById(event.getEventId());
            if (existingEvent.isPresent()) {
                log.warn("Event {} already processed by analytics. Ignoring.", event.getEventId());
                org.slf4j.MDC.clear();
                return;
            }

            // 2. Process Analytics
            BookingCreatedPayload payload = event.getPayload();
            LocalDate today = LocalDate.now();

            AnalyticsRecord record = analyticsRecordRepository.findByStatDate(today)
                    .orElse(AnalyticsRecord.builder()
                            .statDate(today)
                            .totalBookings(0L)
                            .totalRevenue(BigDecimal.ZERO)
                            .totalSeatsSold(0L)
                            .build());

            record.setTotalBookings(record.getTotalBookings() + 1);
            record.setTotalRevenue(record.getTotalRevenue().add(payload.getTotalAmount()));
            record.setTotalSeatsSold(record.getTotalSeatsSold() + payload.getSeatIds().size());

            analyticsRecordRepository.save(record);

            // 3. Mark as Processed (Exactly-once semantics via DB transaction)
            ProcessedEvent processedEvent = ProcessedEvent.builder()
                    .eventId(event.getEventId())
                    .processedAt(LocalDateTime.now())
                    .build();
            processedEventRepository.save(processedEvent);

            log.info("Analytics updated for date {}: {} total bookings today.", today, record.getTotalBookings());

        } catch (Exception e) {
            log.error("Error processing message in analytics service: {}", e.getMessage());
            throw new RuntimeException("Failed to process analytics", e);
        } finally {
            org.slf4j.MDC.clear();
        }
    }
}
