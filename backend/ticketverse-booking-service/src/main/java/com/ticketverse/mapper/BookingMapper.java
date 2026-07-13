package com.ticketverse.mapper;

import com.ticketverse.client.EventServiceClient;
import com.ticketverse.dto.response.BookingResponse;
import com.ticketverse.dto.response.SeatResponse;
import com.ticketverse.entity.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class BookingMapper {

    private final EventServiceClient eventServiceClient;

    public BookingResponse mapToResponse(Booking booking) {
        List<SeatResponse> seats;
        try {
            seats = eventServiceClient.getSeatsByBookingId(booking.getId());
        } catch (Exception e) {
            // Fallback in case of failure
            seats = new java.util.ArrayList<>();
        }

        return BookingResponse.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .bookingDate(booking.getBookingDate())
                .totalAmount(booking.getTotalAmount())
                .bookingStatus(booking.getBookingStatus())
                .eventId(booking.getEventId())
                .seats(seats)

                .build();
    }
}
