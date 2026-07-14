package com.ticketverse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "analytics_daily_stats")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stat_date", nullable = false, unique = true)
    private LocalDate statDate;

    @Column(name = "total_bookings", nullable = false)
    private Long totalBookings;

    @Column(name = "total_revenue", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalRevenue;

    @Column(name = "total_seats_sold", nullable = false)
    private Long totalSeatsSold;
}
