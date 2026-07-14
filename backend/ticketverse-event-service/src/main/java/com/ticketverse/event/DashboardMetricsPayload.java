package com.ticketverse.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricsPayload {
    private Long totalBookings;
    private BigDecimal totalRevenue;
    private Long totalSeatsSold;
}
