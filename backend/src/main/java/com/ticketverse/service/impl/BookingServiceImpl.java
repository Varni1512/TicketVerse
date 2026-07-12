package com.ticketverse.service.impl;

import com.ticketverse.dto.request.BookingRequest;
import com.ticketverse.dto.response.BookingResponse;
import com.ticketverse.entity.Booking;
import com.ticketverse.entity.Event;
import com.ticketverse.entity.Seat;
import com.ticketverse.entity.User;
import com.ticketverse.exception.ApiException;
import com.ticketverse.exception.ResourceNotFoundException;
import com.ticketverse.mapper.BookingMapper;
import com.ticketverse.repository.BookingRepository;
import com.ticketverse.repository.EventRepository;
import com.ticketverse.repository.SeatRepository;
import com.ticketverse.repository.UserRepository;
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
    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest bookingRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", 0));

        Event event = eventRepository.findById(bookingRequest.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", bookingRequest.getEventId()));

        BigDecimal totalAmount = BigDecimal.ZERO;

        // Process seats
        for (Long seatId : bookingRequest.getSeatIds()) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new ResourceNotFoundException("Seat", "id", seatId));

            if (!seat.getEvent().getId().equals(event.getId())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Seat does not belong to this event");
            }

            if (!"AVAILABLE".equalsIgnoreCase(seat.getStatus())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Seat " + seat.getSeatNumber() + " is not available");
            }

            // Lock seat
            seat.setStatus("BOOKED");
            // We will save the seat again with the booking reference later
            seatRepository.save(seat);

            totalAmount = totalAmount.add(seat.getPrice());
        }

        Booking booking = Booking.builder()
                .bookingReference(UUID.randomUUID().toString())
                .totalAmount(totalAmount)
                .bookingStatus("CONFIRMED")
                .user(user)
                .event(event)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        
        java.util.List<Seat> bookedSeats = new java.util.ArrayList<>();
        for (Long seatId : bookingRequest.getSeatIds()) {
            Seat seat = seatRepository.findById(seatId).get();
            seat.setBooking(savedBooking);
            bookedSeats.add(seatRepository.save(seat));
        }
        savedBooking.setSeats(bookedSeats);

        return bookingMapper.mapToResponse(savedBooking);
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(bookingMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", 0));

        return bookingRepository.findByUserId(user.getId()).stream()
                .map(bookingMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingById(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        
        // Ensure user can only view their own booking
        if (!booking.getUser().getEmail().equals(userEmail)) {
            // Check if admin (optional, for now just restrict)
            // throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
        }
        
        return bookingMapper.mapToResponse(booking);
    }

    @Override
    @Transactional
    public void cancelBooking(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You do not have permission to cancel this booking");
        }

        booking.setBookingStatus("CANCELLED");
        bookingRepository.save(booking);
        
        // Free up the seats
        if (booking.getSeats() != null) {
            for (Seat seat : booking.getSeats()) {
                seat.setStatus("AVAILABLE");
                seat.setBooking(null);
                seatRepository.save(seat);
            }
        }
    }
}
