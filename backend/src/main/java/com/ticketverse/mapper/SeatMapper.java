package com.ticketverse.mapper;

import com.ticketverse.dto.request.SeatRequest;
import com.ticketverse.dto.response.SeatResponse;
import com.ticketverse.entity.Event;
import com.ticketverse.entity.Seat;
import org.springframework.stereotype.Component;

@Component
public class SeatMapper {

    public Seat mapToEntity(SeatRequest request, Event event) {
        return Seat.builder()
                .rowNum(request.getRowNum())
                .seatNumber(request.getSeatNumber())
                .type(request.getType())
                .price(request.getPrice())
                .status(request.getStatus())
                .event(event)
                .build();
    }

    public SeatResponse mapToResponse(Seat seat) {
        return SeatResponse.builder()
                .id(seat.getId())
                .rowNum(seat.getRowNum())
                .seatNumber(seat.getSeatNumber())
                .type(seat.getType())
                .price(seat.getPrice())
                .status(seat.getStatus())
                .eventId(seat.getEvent().getId())
                .build();
    }

    public void updateEntity(Seat seat, SeatRequest request) {
        seat.setRowNum(request.getRowNum());
        seat.setSeatNumber(request.getSeatNumber());
        seat.setType(request.getType());
        seat.setPrice(request.getPrice());
        seat.setStatus(request.getStatus());
    }
}
