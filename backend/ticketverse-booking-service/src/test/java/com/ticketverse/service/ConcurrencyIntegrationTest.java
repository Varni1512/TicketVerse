package com.ticketverse.service;

import com.ticketverse.client.EventServiceClient;
import com.ticketverse.dto.request.BookingRequest;
import com.ticketverse.dto.response.EventResponse;
import com.ticketverse.dto.response.SeatResponse;
import com.ticketverse.entity.Booking;
import com.ticketverse.exception.ApiException;
import com.ticketverse.mapper.BookingMapper;
import com.ticketverse.repository.BookingRepository;
import com.ticketverse.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class ConcurrencyIntegrationTest {

    private BookingServiceImpl bookingService;
    private EventServiceClient eventServiceClient;
    private BookingRepository bookingRepository;
    private BookingMapper bookingMapper;
    private RedissonClient redissonClient;

    @BeforeEach
    public void setup() {
        eventServiceClient = mock(EventServiceClient.class);
        bookingRepository = mock(BookingRepository.class);
        bookingMapper = mock(BookingMapper.class);
        redissonClient = mock(RedissonClient.class);
        
        bookingService = new BookingServiceImpl(bookingRepository, eventServiceClient, redissonClient, bookingMapper);

        EventResponse mockEvent = new EventResponse();
        mockEvent.setId(1L);

        SeatResponse mockSeat = new SeatResponse();
        mockSeat.setId(100L);
        mockSeat.setEventId(1L);
        mockSeat.setStatus("AVAILABLE");
        mockSeat.setPrice(BigDecimal.valueOf(500));

        when(eventServiceClient.getEventById(1L)).thenReturn(mockEvent);
        when(eventServiceClient.getSeatById(100L)).thenAnswer(invocation -> {
            SeatResponse copy = new SeatResponse();
            copy.setId(mockSeat.getId());
            copy.setEventId(mockSeat.getEventId());
            copy.setStatus(mockSeat.getStatus());
            copy.setPrice(mockSeat.getPrice());
            return copy;
        });

        when(eventServiceClient.updateSeatStatus(anyLong(), anyString(), any())).thenAnswer(invocation -> {
            String newStatus = invocation.getArgument(1);
            mockSeat.setStatus(newStatus);
            return mockSeat;
        });
        
        Booking mockBooking = new Booking();
        mockBooking.setId(999L);
        when(bookingRepository.save(any(Booking.class))).thenReturn(mockBooking);

        // Mock RedissonClient with a ReentrantLock to simulate Redis locking locally
        ReentrantLock localLock = new ReentrantLock();
        RLock mockRLock = mock(RLock.class);
        
        try {
            when(mockRLock.tryLock(anyLong(), anyLong(), any(TimeUnit.class))).thenAnswer(invocation -> {
                long waitTime = invocation.getArgument(0);
                TimeUnit unit = invocation.getArgument(2);
                return localLock.tryLock(waitTime, unit);
            });
            when(mockRLock.isHeldByCurrentThread()).thenAnswer(invocation -> localLock.isHeldByCurrentThread());
            doAnswer(invocation -> {
                if (localLock.isHeldByCurrentThread()) {
                    localLock.unlock();
                }
                return null;
            }).when(mockRLock).unlock();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        when(redissonClient.getLock(anyString())).thenReturn(mockRLock);
    }

    @Test
    public void testConcurrency_100_Requests() throws InterruptedException {
        runConcurrencyTest(100);
    }

    @Test
    public void testConcurrency_200_Requests() throws InterruptedException {
        runConcurrencyTest(200);
    }

    @Test
    public void testConcurrency_500_Requests() throws InterruptedException {
        runConcurrencyTest(500);
    }

    private void runConcurrencyTest(int numThreads) throws InterruptedException {
        System.out.println("==================================================");
        System.out.println("Starting Concurrency Test with " + numThreads + " requests");
        
        ExecutorService executorService = Executors.newFixedThreadPool(numThreads);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(numThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);
        AtomicInteger otherErrorCount = new AtomicInteger(0);
        
        List<Long> latencies = new CopyOnWriteArrayList<>();

        BookingRequest request = new BookingRequest();
        request.setEventId(1L);
        request.setSeatIds(Collections.singletonList(100L));

        for (int i = 0; i < numThreads; i++) {
            executorService.submit(() -> {
                try {
                    latch.await();
                    long startTime = System.currentTimeMillis();
                    
                    try {
                        bookingService.createBooking(request, 1L);
                        successCount.incrementAndGet();
                    } catch (ApiException e) {
                        if (e.getStatus() == HttpStatus.CONFLICT) {
                            conflictCount.incrementAndGet();
                        } else {
                            otherErrorCount.incrementAndGet();
                        }
                    } catch (Exception e) {
                        otherErrorCount.incrementAndGet();
                    }
                    
                    long endTime = System.currentTimeMillis();
                    latencies.add(endTime - startTime);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        long testStartTime = System.currentTimeMillis();
        latch.countDown(); // release all threads at once
        doneLatch.await(); // wait for all threads to finish
        long testEndTime = System.currentTimeMillis();

        long maxLatency = latencies.stream().mapToLong(v -> v).max().orElse(0);
        long avgLatency = (long) latencies.stream().mapToLong(v -> v).average().orElse(0.0);

        System.out.println("Total Requests: " + numThreads);
        System.out.println("Successful Bookings: " + successCount.get());
        System.out.println("Failed Bookings (Conflict): " + conflictCount.get());
        System.out.println("Other Errors: " + otherErrorCount.get());
        System.out.println("Duplicate Bookings: " + (successCount.get() > 1 ? (successCount.get() - 1) : 0));
        System.out.println("Average Response Time: " + avgLatency + " ms");
        System.out.println("Maximum Response Time: " + maxLatency + " ms");
        System.out.println("Total Execution Time: " + (testEndTime - testStartTime) + " ms");
        System.out.println("==================================================\n");

        executorService.shutdown();
    }
}
