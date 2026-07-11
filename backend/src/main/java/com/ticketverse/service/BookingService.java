package com.ticketverse.service;

import com.ticketverse.dto.request.BookingRequest;
import com.ticketverse.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest bookingRequest, String userEmail);
    List<BookingResponse> getAllBookings();
    List<BookingResponse> getUserBookings(String userEmail);
    BookingResponse getBookingById(Long id, String userEmail);
    void cancelBooking(Long id, String userEmail);
}
