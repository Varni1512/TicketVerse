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
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import jakarta.annotation.PostConstruct;
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
    private final MeterRegistry meterRegistry;

    private Counter bookingsTotal;
    private Counter bookingsSuccess;
    private Counter bookingsFailed;
    private Counter revenueTotal;
    private Counter seatLockCount;
    private Counter lockTimeoutCount;
    private Timer lockWaitTime;

    @PostConstruct
    public void initMetrics() {
        this.bookingsTotal = meterRegistry.counter("business.bookings.total");
        this.bookingsSuccess = meterRegistry.counter("business.bookings.success");
        this.bookingsFailed = meterRegistry.counter("business.bookings.failed");
        this.revenueTotal = meterRegistry.counter("business.revenue.total");
        this.seatLockCount = meterRegistry.counter("business.seat.locks.total");
        this.lockTimeoutCount = meterRegistry.counter("business.seat.locks.timeout");
        this.lockWaitTime = meterRegistry.timer("business.seat.locks.wait_time");
    }

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest bookingRequest, Long userId, String userEmail) {
        bookingsTotal.increment();
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
                seatLockCount.increment();
                RLock lock = redissonClient.getLock("seat_lock:" + seatId);
                
                long startTime = System.nanoTime();
                boolean isLocked = lock.tryLock(5, 60, TimeUnit.SECONDS);
                lockWaitTime.record(System.nanoTime() - startTime, TimeUnit.NANOSECONDS);
                
                if (!isLocked) {
                    lockTimeoutCount.increment();
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

            List<String> seatDetailList = new ArrayList<>();

            for (Long seatId : sortedSeatIds) {
                SeatResponse seat = eventServiceClient.getSeatById(seatId);

                if (!seat.getEventId().equals(event.getId())) {
                    throw new ApiException(HttpStatus.BAD_REQUEST, "Seat does not belong to this event");
                }

                if (!"AVAILABLE".equalsIgnoreCase(seat.getStatus())) {
                    throw new ApiException(HttpStatus.CONFLICT, "Seat " + seat.getSeatNumber() + " is already booked or not available");
                }

                seatDetailList.add(seat.getRowNum() + seat.getSeatNumber());
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
            
            String seatDetailsStr = String.join(", ", seatDetailList);
            
            // 4. (Removed Synchronous REST Call) Seat Status is now updated asynchronously via Event Service consuming BookingCreatedEvent.

            com.ticketverse.event.BookingCreatedPayload payload = com.ticketverse.event.BookingCreatedPayload.builder()
                    .bookingId(savedBooking.getId())
                    .userId(userId)
                    .userEmail(userEmail)
                    .eventId(event.getId())
                    .seatIds(sortedSeatIds)
                    .bookingTime(LocalDateTime.now())
                    .totalAmount(totalAmount)
                    .status(savedBooking.getBookingStatus())
                    .eventName(event.getTitle())
                    .eventDate(event.getEventDate() != null ? String.valueOf(event.getEventDate()) : "")
                    .eventTime(event.getStartTime() != null ? String.valueOf(event.getStartTime()) : "")
                    .eventVenue(event.getVenue())
                    .seatDetails(seatDetailsStr)
                    .build();

            com.ticketverse.event.DomainEvent<com.ticketverse.event.BookingCreatedPayload> domainEvent = 
                    com.ticketverse.event.DomainEvent.create("BOOKING_CREATED", correlationId, "ticketverse-booking-service", payload, null);

            kafkaTemplate.send("booking-created-topic", event.getId().toString(), domainEvent);

            bookingSuccessful = true;
            bookingsSuccess.increment();
            revenueTotal.increment(totalAmount.doubleValue());
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
                bookingsFailed.increment();
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

    @Override
    @Transactional
    public BookingResponse adminDirectBooking(BookingRequest bookingRequest, String targetUserEmail) {
        bookingsTotal.increment();
        String correlationId = java.util.UUID.randomUUID().toString();
        
        List<Long> sortedSeatIds = bookingRequest.getSeatIds().stream()
                .sorted()
                .collect(Collectors.toList());
        List<RLock> acquiredLocks = new ArrayList<>();
        boolean bookingSuccessful = false;

        try {
            for (Long seatId : sortedSeatIds) {
                seatLockCount.increment();
                RLock lock = redissonClient.getLock("seat_lock:" + seatId);
                boolean isLocked = lock.tryLock(5, 60, TimeUnit.SECONDS);
                if (!isLocked) {
                    throw new ApiException(HttpStatus.CONFLICT, "Seat " + seatId + " is currently being booked by another user");
                }
                acquiredLocks.add(lock);
            }

            EventResponse event = eventServiceClient.getEventById(bookingRequest.getEventId());
            BigDecimal totalAmount = BigDecimal.ZERO;

            List<String> seatDetailList = new ArrayList<>();
            for (Long seatId : sortedSeatIds) {
                SeatResponse seat = eventServiceClient.getSeatById(seatId);
                if (!seat.getEventId().equals(event.getId())) {
                    throw new ApiException(HttpStatus.BAD_REQUEST, "Seat does not belong to this event");
                }
                if (!"AVAILABLE".equalsIgnoreCase(seat.getStatus())) {
                    throw new ApiException(HttpStatus.CONFLICT, "Seat " + seat.getSeatNumber() + " is already booked or not available");
                }
                seatDetailList.add(seat.getRowNum() + seat.getSeatNumber());
                totalAmount = totalAmount.add(seat.getPrice());
            }

            // Using userId 1 as a placeholder for admin booking if user doesn't exist, but typically admin uses their own ID
            // Here we just use a dummy ID 999 for "admin direct booking" if we don't have the user's ID
            Long dummyUserId = 999L;
            
            Booking booking = Booking.builder()
                    .bookingReference(UUID.randomUUID().toString())
                    .totalAmount(totalAmount)
                    .bookingStatus("CONFIRMED")
                    .userId(dummyUserId)
                    .eventId(event.getId())
                    .build();

            Booking savedBooking = bookingRepository.save(booking);
            
            String seatDetailsStr = String.join(", ", seatDetailList);

            com.ticketverse.event.BookingCreatedPayload payload = com.ticketverse.event.BookingCreatedPayload.builder()
                    .bookingId(savedBooking.getId())
                    .userId(dummyUserId)
                    .userEmail(targetUserEmail != null && !targetUserEmail.isEmpty() ? targetUserEmail : "admin@ticketverse.com")
                    .eventId(event.getId())
                    .seatIds(sortedSeatIds)
                    .bookingTime(LocalDateTime.now())
                    .totalAmount(totalAmount)
                    .status(savedBooking.getBookingStatus())
                    .eventName(event.getTitle())
                    .eventDate(event.getEventDate() != null ? String.valueOf(event.getEventDate()) : "")
                    .eventTime(event.getStartTime() != null ? String.valueOf(event.getStartTime()) : "")
                    .eventVenue(event.getVenue())
                    .seatDetails(seatDetailsStr)
                    .build();

            com.ticketverse.event.DomainEvent<com.ticketverse.event.BookingCreatedPayload> domainEvent = 
                    com.ticketverse.event.DomainEvent.create("BOOKING_CREATED", correlationId, "ticketverse-booking-service", payload, null);

            kafkaTemplate.send("booking-created-topic", event.getId().toString(), domainEvent);

            bookingSuccessful = true;
            bookingsSuccess.increment();
            revenueTotal.increment(totalAmount.doubleValue());
            return bookingMapper.mapToResponse(savedBooking);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Thread interrupted while acquiring locks");
        } finally {
            for (int i = acquiredLocks.size() - 1; i >= 0; i--) {
                RLock lock = acquiredLocks.get(i);
                if (lock != null && lock.isHeldByCurrentThread()) {
                    lock.unlock();
                }
            }
            if (!bookingSuccessful) {
                bookingsFailed.increment();
            }
        }
    }

    @Override
    public java.util.Map<String, Object> getAdminStats() {
        List<Booking> allBookings = bookingRepository.findAll();
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        
        long totalBookingsToday = 0;
        BigDecimal totalRevenueToday = BigDecimal.ZERO;
        
        for (Booking b : allBookings) {
            if ("CONFIRMED".equals(b.getBookingStatus()) && b.getBookingDate().isAfter(today)) {
                totalBookingsToday++;
                totalRevenueToday = totalRevenueToday.add(b.getTotalAmount());
            }
        }
        
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalBookings", totalBookingsToday);
        stats.put("totalRevenue", totalRevenueToday);
        // Estimate 2 seats per booking if we don't query event service for every booking
        stats.put("totalSeatsSold", totalBookingsToday * 2);
        
        return stats;
    }

    @Override
    public List<java.util.Map<String, Object>> getAdminAnalytics() {
        List<Booking> allBookings = bookingRepository.findAll();
        
        // Group by date (YYYY-MM-DD)
        java.util.Map<String, BigDecimal> revenueByDate = new java.util.HashMap<>();
        java.util.Map<String, Integer> ticketsByDate = new java.util.HashMap<>();
        
        for (Booking b : allBookings) {
            if ("CONFIRMED".equals(b.getBookingStatus())) {
                String dateStr = b.getBookingDate().toLocalDate().toString();
                revenueByDate.put(dateStr, revenueByDate.getOrDefault(dateStr, BigDecimal.ZERO).add(b.getTotalAmount()));
                // Estimate 2 seats per booking
                ticketsByDate.put(dateStr, ticketsByDate.getOrDefault(dateStr, 0) + 2);
            }
        }
        
        List<java.util.Map<String, Object>> analytics = new ArrayList<>();
        // Sort dates
        List<String> sortedDates = new ArrayList<>(revenueByDate.keySet());
        Collections.sort(sortedDates);
        
        for (String date : sortedDates) {
            java.util.Map<String, Object> dayStat = new java.util.HashMap<>();
            dayStat.put("date", date);
            dayStat.put("revenue", revenueByDate.get(date));
            dayStat.put("tickets", ticketsByDate.get(date));
            analytics.add(dayStat);
        }
        
        return analytics;
    }
}
