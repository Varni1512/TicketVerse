package com.ticketverse.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_processed_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessedEvent {
    
    @Id
    @Column(name = "event_id", nullable = false)
    private String eventId; // The Kafka DomainEvent.eventId

    @Column(name = "processed_at", nullable = false)
    private LocalDateTime processedAt;
}
