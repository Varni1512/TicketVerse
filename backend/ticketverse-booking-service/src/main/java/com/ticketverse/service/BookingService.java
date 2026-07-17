package com.ticketverse.service;

import com.ticketverse.dto.request.BookingRequest;
import com.ticketverse.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest bookingRequest, Long userId, String userEmail);
    BookingResponse adminDirectBooking(BookingRequest bookingRequest, String targetUserEmail);
    List<BookingResponse> getAllBookings();
    List<BookingResponse> getUserBookings(Long userId);
    BookingResponse getBookingById(Long id, Long userId);
    void cancelBooking(Long id, Long userId);
    
    java.util.Map<String, Object> getAdminStats();
    List<java.util.Map<String, Object>> getAdminAnalytics();
}
