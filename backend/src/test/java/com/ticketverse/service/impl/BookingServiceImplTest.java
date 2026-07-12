package com.ticketverse.service.impl;

import com.ticketverse.dto.request.BookingRequest;
import com.ticketverse.dto.response.BookingResponse;
import com.ticketverse.entity.Event;
import com.ticketverse.entity.Seat;
import com.ticketverse.entity.User;
import com.ticketverse.mapper.BookingMapper;
import com.ticketverse.repository.BookingRepository;
import com.ticketverse.repository.EventRepository;
import com.ticketverse.repository.SeatRepository;
import com.ticketverse.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private SeatRepository seatRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookingMapper bookingMapper;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private User user;
    private Event event;
    private Seat seat;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        event = new Event();
        event.setId(1L);

        seat = new Seat();
        seat.setId(1L);
        seat.setEvent(event);
        seat.setStatus("AVAILABLE");
        seat.setPrice(new BigDecimal("100.00"));
    }

    @Test
    void testCreateBooking_Success() {
        BookingRequest request = new BookingRequest(1L, List.of(1L), "123456");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(seatRepository.findById(1L)).thenReturn(Optional.of(seat));

        BookingResponse mockResponse = new BookingResponse();
        mockResponse.setTotalAmount(new BigDecimal("100.00"));
        
        when(bookingRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(bookingMapper.mapToResponse(any())).thenReturn(mockResponse);

        BookingResponse response = bookingService.createBooking(request, "test@example.com");

        assertEquals(new BigDecimal("100.00"), response.getTotalAmount());
        assertEquals("BOOKED", seat.getStatus());
        verify(seatRepository, times(1)).save(seat);
        verify(bookingRepository, times(1)).save(any());
    }
}
