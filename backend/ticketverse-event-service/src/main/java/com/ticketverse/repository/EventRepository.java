package com.ticketverse.repository;

import com.ticketverse.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT DISTINCT e.category FROM Event e WHERE e.category IS NOT NULL")
    List<String> findDistinctCategories();
}
