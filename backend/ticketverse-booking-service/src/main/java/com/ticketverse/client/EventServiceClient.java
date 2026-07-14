package com.ticketverse.client;

import com.ticketverse.dto.response.EventResponse;
import com.ticketverse.dto.response.SeatResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@FeignClient(name = "event-service", url = "${event.service.url:http://localhost:8082}")
@CircuitBreaker(name = "eventService")
@Retry(name = "eventService")
public interface EventServiceClient {

    @GetMapping("/api/events/{id}")
    EventResponse getEventById(@PathVariable("id") Long id);

    @GetMapping("/api/seats/{id}")
    SeatResponse getSeatById(@PathVariable("id") Long id);

    @PostMapping("/api/seats/{id}/status")
    SeatResponse updateSeatStatus(@PathVariable("id") Long id, @RequestParam("status") String status, @RequestParam(value = "bookingId", required = false) Long bookingId);

    @GetMapping("/api/seats/booking/{bookingId}")
    java.util.List<SeatResponse> getSeatsByBookingId(@PathVariable("bookingId") Long bookingId);
}
