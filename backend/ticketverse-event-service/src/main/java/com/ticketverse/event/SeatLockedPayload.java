package com.ticketverse.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatLockedPayload {
    private Long eventId;
    private Long seatId;
    private Long userId;
    private long remainingLockTimeSeconds;
}
