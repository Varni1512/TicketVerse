package com.ticketverse.repository;

import com.ticketverse.entity.AlbumMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlbumMediaRepository extends JpaRepository<AlbumMedia, Long> {
    List<AlbumMedia> findByEventId(Long eventId);
}
