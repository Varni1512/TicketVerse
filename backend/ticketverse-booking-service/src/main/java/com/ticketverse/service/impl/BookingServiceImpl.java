package com.ticketverse.service.impl;

import com.ticketverse.dto.request.BookingRequest;
import com.ticketverse.dto.response.BookingResponse;
import com.ticketverse.entity.Booking;
import com.ticketverse.exception.ApiException;
import com.ticketverse.exception.ResourceNotFoundException;
import com.ticketverse.mapper.BookingMapper;
import com.ticketverse.repository.BookingRepository;
import com.ticketverse.client.EventServiceClient;
import com.ticketverse.dto.response.EventResponse;
import com.ticketverse.dto.response.SeatResponse;
import com.ticketverse.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EventServiceClient eventServiceClient;
    private final RedissonClient redissonClient;
    private final BookingMapper bookingMapper;
    private final org.springframework.kafka.core.KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest bookingRequest, Long userId) {
        String correlationId = java.util.UUID.randomUUID().toString();
        org.slf4j.MDC.put("correlationId", correlationId);
        
        List<Long> sortedSeatIds = bookingRequest.getSeatIds().stream()
                .sorted()
                .collect(Collectors.toList());
        List<RLock> acquiredLocks = new ArrayList<>();
        boolean bookingSuccessful = false;

        try {
            // 1. Acquire Redis Locks for all requested seats
            for (Long seatId : sortedSeatIds) {
                RLock lock = redissonClient.getLock("seat_lock:" + seatId);
                boolean isLocked = lock.tryLock(5, 60, TimeUnit.SECONDS);
                if (!isLocked) {
                    throw new ApiException(HttpStatus.CONFLICT, "Seat " + seatId + " is currently being booked by another user");
                }
                acquiredLocks.add(lock);
                
                // Publish SeatLockedEvent
                com.ticketverse.event.SeatLockedPayload lockedPayload = com.ticketverse.event.SeatLockedPayload.builder()
                        .eventId(bookingRequest.getEventId())
                        .seatId(seatId)
                        .userId(userId)
                        .remainingLockTimeSeconds(60L)
                        .build();
                com.ticketverse.event.DomainEvent<com.ticketverse.event.SeatLockedPayload> lockedEvent = 
                        com.ticketverse.event.DomainEvent.create("SEAT_LOCKED", correlationId, "ticketverse-booking-service", lockedPayload, null);
                kafkaTemplate.send("seat-events-topic", bookingRequest.getEventId().toString(), lockedEvent);
            }

            // 2. Fetch Event and Verify Seats
            EventResponse event = eventServiceClient.getEventById(bookingRequest.getEventId());
            BigDecimal totalAmount = BigDecimal.ZERO;

            for (Long seatId : sortedSeatIds) {
                SeatResponse seat = eventServiceClient.getSeatById(seatId);

                if (!seat.getEventId().equals(event.getId())) {
                    throw new ApiException(HttpStatus.BAD_REQUEST, "Seat does not belong to this event");
                }

                if (!"AVAILABLE".equalsIgnoreCase(seat.getStatus())) {
                    throw new ApiException(HttpStatus.CONFLICT, "Seat " + seat.getSeatNumber() + " is already booked or not available");
                }

                // Temporary reservation is no longer needed since we hold the Redis lock
                totalAmount = totalAmount.add(seat.getPrice());
            }

            // 3. Create Booking
            Booking booking = Booking.builder()
                    .bookingReference(UUID.randomUUID().toString())
                    .totalAmount(totalAmount)
                    .bookingStatus("CONFIRMED")
                    .userId(userId)
                    .eventId(event.getId())
                    .build();

            Booking savedBooking = bookingRepository.save(booking);
            
            // 4. (Removed Synchronous REST Call) Seat Status is now updated asynchronously via Event Service consuming BookingCreatedEvent.

            // 5. Publish Kafka Event
            com.ticketverse.event.BookingCreatedPayload payload = com.ticketverse.event.BookingCreatedPayload.builder()
                    .bookingId(savedBooking.getId())
                    .userId(userId)
                    .eventId(event.getId())
                    .seatIds(sortedSeatIds)
                    .bookingTime(LocalDateTime.now())
                    .totalAmount(totalAmount)
                    .status(savedBooking.getBookingStatus())
                    .build();

            com.ticketverse.event.DomainEvent<com.ticketverse.event.BookingCreatedPayload> domainEvent = 
                    com.ticketverse.event.DomainEvent.create("BOOKING_CREATED", correlationId, "ticketverse-booking-service", payload, null);

            // Publish using eventId as the key to guarantee correct event ordering
            kafkaTemplate.send("booking-created-topic", event.getId().toString(), domainEvent);

            bookingSuccessful = true;
            return bookingMapper.mapToResponse(savedBooking);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Thread interrupted while acquiring locks");
        } finally {
            // 5. Release all locks in reverse order
            for (int i = acquiredLocks.size() - 1; i >= 0; i--) {
                RLock lock = acquiredLocks.get(i);
                if (lock != null && lock.isHeldByCurrentThread()) {
                    lock.unlock();
                }
            }
            // If booking failed, publish SeatUnlockedEvent explicitly so WebSocket clients instantly see it available
            if (!bookingSuccessful) {
                for (Long seatId : sortedSeatIds) {
                    com.ticketverse.event.SeatUnlockedPayload unlockedPayload = com.ticketverse.event.SeatUnlockedPayload.builder()
                            .eventId(bookingRequest.getEventId())
                            .seatId(seatId)
                            .build();
                    com.ticketverse.event.DomainEvent<com.ticketverse.event.SeatUnlockedPayload> unlockedEvent = 
                            com.ticketverse.event.DomainEvent.create("SEAT_UNLOCKED", correlationId, "ticketverse-booking-service", unlockedPayload, null);
                    kafkaTemplate.send("seat-events-topic", bookingRequest.getEventId().toString(), unlockedEvent);
                }
            }
            org.slf4j.MDC.clear();
        }
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(bookingMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(bookingMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingById(Long id, Long userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        
        // Ensure user can only view their own booking
        if (!booking.getUserId().equals(userId)) {
            // Check if admin (optional, for now just restrict)
            // throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
        }
        
        return bookingMapper.mapToResponse(booking);
    }

    @Override
    @Transactional
    public void cancelBooking(Long id, Long userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        if (!booking.getUserId().equals(userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You do not have permission to cancel this booking");
        }

        booking.setBookingStatus("CANCELLED");
        bookingRepository.save(booking);
        
        // Publish BookingCancelledEvent for WebSockets and Event Service
        com.ticketverse.event.BookingCancelledPayload payload = com.ticketverse.event.BookingCancelledPayload.builder()
                .bookingId(booking.getId())
                .eventId(booking.getEventId())
                .build();
        
        com.ticketverse.event.DomainEvent<com.ticketverse.event.BookingCancelledPayload> domainEvent = 
                com.ticketverse.event.DomainEvent.create("BOOKING_CANCELLED", UUID.randomUUID().toString(), "ticketverse-booking-service", payload, null);
        
        kafkaTemplate.send("booking-created-topic", booking.getEventId().toString(), domainEvent);
    }
}
