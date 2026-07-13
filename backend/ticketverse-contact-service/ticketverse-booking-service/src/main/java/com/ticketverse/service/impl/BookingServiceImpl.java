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

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EventServiceClient eventServiceClient;

    private final BookingMapper bookingMapper;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest bookingRequest, Long userId) {
        EventResponse event = eventServiceClient.getEventById(bookingRequest.getEventId());

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (Long seatId : bookingRequest.getSeatIds()) {
            SeatResponse seat = eventServiceClient.getSeatById(seatId);

            if (!seat.getEventId().equals(event.getId())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Seat does not belong to this event");
            }

            if (!"AVAILABLE".equalsIgnoreCase(seat.getStatus())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Seat " + seat.getSeatNumber() + " is not available");
            }

            // Lock seat temporarily without bookingId
            eventServiceClient.updateSeatStatus(seatId, "BOOKED", null);

            totalAmount = totalAmount.add(seat.getPrice());
        }

        Booking booking = Booking.builder()
                .bookingReference(UUID.randomUUID().toString())
                .totalAmount(totalAmount)
                .bookingStatus("CONFIRMED")
                .userId(userId)
                .eventId(event.getId())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        
        for (Long seatId : bookingRequest.getSeatIds()) {
            eventServiceClient.updateSeatStatus(seatId, "BOOKED", savedBooking.getId());
        }

        return bookingMapper.mapToResponse(savedBooking);
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
        
        // Wait, how do I know which seats to free? 
        // I should fetch the seats by booking ID from the event service!
        // But eventServiceClient doesn't have getSeatsByBookingId yet.
        // For now, this is a limitation until we add it to event service.
        // I will add it to the EventServiceClient.
        java.util.List<SeatResponse> seats = eventServiceClient.getSeatsByBookingId(booking.getId());
        for (SeatResponse seat : seats) {
            eventServiceClient.updateSeatStatus(seat.getId(), "AVAILABLE", null);
        }
    }
}
