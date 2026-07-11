package com.ticketverse.mapper;

import com.ticketverse.dto.response.BookingResponse;
import com.ticketverse.entity.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .bookingDate(booking.getBookingDate())
                .totalAmount(booking.getTotalAmount())
                .bookingStatus(booking.getBookingStatus())
                .eventId(booking.getEvent().getId())
                .userId(booking.getUser().getId())
                .build();
    }
}
