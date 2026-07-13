package com.ticketverse.mapper;

import com.ticketverse.dto.response.BookingResponse;
import com.ticketverse.dto.response.SeatResponse;
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

                .seats(booking.getSeats() != null ? booking.getSeats().stream().map(seat -> SeatResponse.builder()
                        .id(seat.getId())
                        .rowNum(seat.getRowNum())
                        .seatNumber(seat.getSeatNumber())
                        .type(seat.getType())
                        .price(seat.getPrice())
                        .status(seat.getStatus())
                        .eventId(seat.getEvent().getId())
                        .build()).collect(java.util.stream.Collectors.toList()) : new java.util.ArrayList<>())
                .build();
    }
}
