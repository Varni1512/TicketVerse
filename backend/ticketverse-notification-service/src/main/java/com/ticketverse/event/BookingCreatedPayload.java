package com.ticketverse.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Payload for the BookingCreatedEvent.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreatedPayload {
    private Long bookingId;
    private Long userId;
    private Long eventId;
    private List<Long> seatIds;
    private LocalDateTime bookingTime;
    private BigDecimal totalAmount;
    private String status;
}
