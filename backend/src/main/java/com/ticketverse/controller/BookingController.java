package com.ticketverse.controller;

import com.ticketverse.dto.request.BookingRequest;
import com.ticketverse.dto.response.BookingResponse;
import com.ticketverse.service.BookingService;
import com.ticketverse.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(Authentication authentication) {
        String userEmail = authentication.getName();
        otpService.generateAndSendOtp(userEmail);
        return ResponseEntity.ok("OTP sent to your email address.");
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest bookingRequest, Authentication authentication) {
        String userEmail = authentication.getName();
        
        // Verify OTP
        boolean isValid = otpService.verifyOtp(userEmail, bookingRequest.getOtpCode());
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP or OTP expired");
        }
        
        try {
            BookingResponse bookingResponse = bookingService.createBooking(bookingRequest, userEmail);
            return new ResponseEntity<>(bookingResponse, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(Authentication authentication) {
        // Here we could check if user is admin to return all bookings, else return only user's bookings.
        String userEmail = authentication.getName();
        // Assuming user gets only their bookings for simplicity
        return ResponseEntity.ok(bookingService.getUserBookings(userEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.getBookingById(id, userEmail));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        bookingService.cancelBooking(id, userEmail);
        return ResponseEntity.ok("Booking cancelled successfully!");
    }
}
