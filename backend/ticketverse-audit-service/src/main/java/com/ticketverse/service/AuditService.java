package com.ticketverse.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketverse.entity.AuditLog;
import com.ticketverse.entity.ProcessedEvent;
import com.ticketverse.event.BookingCreatedPayload;
import com.ticketverse.event.DomainEvent;
import com.ticketverse.repository.AuditLogRepository;
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
public class AuditService {

    private final ProcessedEventRepository processedEventRepository;
    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "booking-created-topic", groupId = "audit-group")
    @Transactional
    public void consumeBookingCreatedEvent(String message) {
        try {
            DomainEvent<BookingCreatedPayload> event = objectMapper.readValue(message, new TypeReference<>() {});
            
            log.info("Audit received BookingCreatedEvent: correlationId={}", event.getCorrelationId());
            org.slf4j.MDC.put("correlationId", event.getCorrelationId());

            // 1. Idempotency Check
            Optional<ProcessedEvent> existingEvent = processedEventRepository.findById(event.getEventId());
            if (existingEvent.isPresent()) {
                log.warn("Event {} already processed by audit. Ignoring.", event.getEventId());
                org.slf4j.MDC.clear();
                return;
            }

            // 2. Save Audit Log
            AuditLog auditLog = AuditLog.builder()
                    .eventId(event.getEventId())
                    .eventType(event.getEventType())
                    .correlationId(event.getCorrelationId())
                    .producerService(event.getProducerService())
                    .timestamp(event.getTimestamp())
                    .payload(objectMapper.writeValueAsString(event.getPayload()))
                    .build();

            auditLogRepository.save(auditLog);

            // 3. Mark as Processed (Exactly-once semantics via DB transaction)
            ProcessedEvent processedEvent = ProcessedEvent.builder()
                    .eventId(event.getEventId())
                    .processedAt(LocalDateTime.now())
                    .build();
            processedEventRepository.save(processedEvent);

            log.info("Audit log saved successfully for event {}", event.getEventId());

        } catch (Exception e) {
            log.error("Error processing message in audit service: {}", e.getMessage());
            throw new RuntimeException("Failed to process audit log", e);
        } finally {
            org.slf4j.MDC.clear();
        }
    }
}
