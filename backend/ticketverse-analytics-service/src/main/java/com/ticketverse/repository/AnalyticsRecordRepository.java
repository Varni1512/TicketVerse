package com.ticketverse.repository;

import com.ticketverse.entity.AnalyticsRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface AnalyticsRecordRepository extends JpaRepository<AnalyticsRecord, Long> {
    Optional<AnalyticsRecord> findByStatDate(LocalDate statDate);
}
