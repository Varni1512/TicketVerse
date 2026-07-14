package com.ticketverse.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * A generic wrapper for all Kafka events to enforce a standard structure.
 * Designed for future compatibility and exactly-once processing.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomainEvent<T> {
    
    private String eventId;          // Unique ID for idempotency
    private String eventVersion;     // e.g., "v1"
    private String eventType;        // e.g., "BOOKING_CREATED"
    private String correlationId;    // For distributed tracing across microservices
    private LocalDateTime timestamp;
    private String producerService;  // e.g., "ticketverse-booking-service"
    private T payload;               // The actual event data
    private Map<String, Object> metadata; // Extensible metadata for future consumers

    public static <T> DomainEvent<T> create(String eventType, String correlationId, String producerService, T payload, Map<String, Object> metadata) {
        return DomainEvent.<T>builder()
                .eventId(UUID.randomUUID().toString())
                .eventVersion("v1")
                .eventType(eventType)
                .correlationId(correlationId != null ? correlationId : UUID.randomUUID().toString())
                .timestamp(LocalDateTime.now())
                .producerService(producerService)
                .payload(payload)
                .metadata(metadata)
                .build();
    }
}
