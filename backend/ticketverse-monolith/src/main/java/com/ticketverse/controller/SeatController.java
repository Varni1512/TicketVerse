package com.ticketverse.controller;

import com.ticketverse.dto.request.SeatRequest;
import com.ticketverse.dto.response.SeatResponse;
import com.ticketverse.service.SeatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    // POST /api/events/{id}/seats (Admin only - to create a seat for an event)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/api/events/{eventId}/seats")
    public ResponseEntity<SeatResponse> createSeat(@PathVariable Long eventId, @Valid @RequestBody SeatRequest seatRequest) {
        SeatResponse seatResponse = seatService.createSeat(eventId, seatRequest);
        return new ResponseEntity<>(seatResponse, HttpStatus.CREATED);
    }

    // POST /api/events/{id}/seats/bulk (Admin only - bulk create seats)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/api/events/{eventId}/seats/bulk")
    public ResponseEntity<List<SeatResponse>> createSeatsBulk(@PathVariable Long eventId, @Valid @RequestBody List<SeatRequest> seatRequests) {
        List<SeatResponse> seatResponses = seatService.createSeatsBulk(eventId, seatRequests);
        return new ResponseEntity<>(seatResponses, HttpStatus.CREATED);
    }

    // GET /api/events/{id}/seats (Public/User)
    @GetMapping("/api/events/{eventId}/seats")
    public ResponseEntity<List<SeatResponse>> getSeatsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(seatService.getSeatsByEventId(eventId));
    }

    // PUT /api/seats/{id} (Admin only - or maybe user for status update during booking? Usually booking has its own logic)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/api/seats/{id}")
    public ResponseEntity<SeatResponse> updateSeat(@PathVariable Long id, @Valid @RequestBody SeatRequest seatRequest) {
        return ResponseEntity.ok(seatService.updateSeat(id, seatRequest));
    }

    // GET /api/seats/{id} (Public/User)
    @GetMapping("/api/seats/{id}")
    public ResponseEntity<SeatResponse> getSeatById(@PathVariable Long id) {
        return ResponseEntity.ok(seatService.getSeatById(id));
    }
}
