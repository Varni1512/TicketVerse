package com.ticketverse.controller;

import com.ticketverse.dto.request.BookingRequest;
import com.ticketverse.dto.response.BookingResponse;
import com.ticketverse.security.JwtTokenProvider;
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
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(Authentication authentication) {
        String userEmail = authentication.getName();
        otpService.generateAndSendOtp(userEmail);
        return ResponseEntity.ok("OTP sent to your email address.");
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest bookingRequest, Authentication authentication, @RequestHeader("Authorization") String token) {
        String userEmail = authentication.getName();
        
        // Verify OTP
        boolean isValid = otpService.verifyOtp(userEmail, bookingRequest.getOtpCode());
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP or OTP expired");
        }
        
        try {
            Long userId = jwtTokenProvider.getUserId(token.substring(7));
            BookingResponse bookingResponse = bookingService.createBooking(bookingRequest, userId);
            return new ResponseEntity<>(bookingResponse, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(Authentication authentication, @RequestHeader("Authorization") String token) {
        Long userId = jwtTokenProvider.getUserId(token.substring(7));
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Long userId = jwtTokenProvider.getUserId(token.substring(7));
        // Note: getBookingById currently takes userEmail in BookingService interface, I need to fix it.
        return ResponseEntity.ok(bookingService.getBookingById(id, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Long userId = jwtTokenProvider.getUserId(token.substring(7));
        bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok("Booking cancelled successfully!");
    }
}
