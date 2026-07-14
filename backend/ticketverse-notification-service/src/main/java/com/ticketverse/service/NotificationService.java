package com.ticketverse.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketverse.entity.ProcessedEvent;
import com.ticketverse.event.BookingCreatedPayload;
import com.ticketverse.event.DomainEvent;
import com.ticketverse.repository.ProcessedEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final ProcessedEventRepository processedEventRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "booking-created-topic", groupId = "notification-group")
    @Transactional
    public void consumeBookingCreatedEvent(String message) {
        try {
            // Spring Kafka might deserialize it as a LinkedHashMap. We convert it properly.
            DomainEvent<BookingCreatedPayload> event = objectMapper.readValue(message, new TypeReference<>() {});
            
            log.info("Received BookingCreatedEvent: correlationId={}", event.getCorrelationId());
            org.slf4j.MDC.put("correlationId", event.getCorrelationId());

            // 1. Idempotency Check
            Optional<ProcessedEvent> existingEvent = processedEventRepository.findById(event.getEventId());
            if (existingEvent.isPresent()) {
                log.warn("Event {} already processed. Ignoring duplicate.", event.getEventId());
                org.slf4j.MDC.clear();
                return;
            }

            // 2. Process Notification
            BookingCreatedPayload payload = event.getPayload();
            log.info("Sending confirmation email for booking {} to user {}", payload.getBookingId(), payload.getUserId());
            
            // Simulate sending email
            simulateEmailSending(payload);

            // 3. Mark as Processed (Exactly-once semantics via DB transaction)
            ProcessedEvent processedEvent = ProcessedEvent.builder()
                    .eventId(event.getEventId())
                    .processedAt(LocalDateTime.now())
                    .build();
            processedEventRepository.save(processedEvent);

            log.info("Notification successfully sent for booking {}", payload.getBookingId());

        } catch (Exception e) {
            log.error("Error processing booking-created-topic message: {}", e.getMessage());
            throw new RuntimeException("Failed to process message, triggering retry/DLQ", e);
        } finally {
            org.slf4j.MDC.clear();
        }
    }

    private void simulateEmailSending(BookingCreatedPayload payload) {
        // Simulate potential network issues/latency
        try {
            Thread.sleep(200);
            // Simulate 5% chance of failure for retry demonstration
            if (Math.random() < 0.05) {
                throw new RuntimeException("Simulated SMTP Server Down");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
