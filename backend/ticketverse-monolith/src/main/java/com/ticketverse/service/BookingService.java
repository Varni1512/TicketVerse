package com.ticketverse.service;

import com.ticketverse.dto.request.BookingRequest;
import com.ticketverse.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest bookingRequest, Long userId);
    List<BookingResponse> getAllBookings();
    List<BookingResponse> getUserBookings(Long userId);
    BookingResponse getBookingById(Long id, Long userId);
    void cancelBooking(Long id, Long userId);
}
