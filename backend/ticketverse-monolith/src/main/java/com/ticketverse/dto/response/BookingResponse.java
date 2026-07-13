package com.ticketverse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long id;
    private String bookingReference;
    private LocalDateTime bookingDate;
    private BigDecimal totalAmount;
    private String bookingStatus;
    private Long eventId;
    private Long userId;
    private java.util.List<SeatResponse> seats;
}
