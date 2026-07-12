package com.ticketverse.service;

import com.ticketverse.dto.request.SeatRequest;
import com.ticketverse.dto.response.SeatResponse;

import java.util.List;

public interface SeatService {
    List<SeatResponse> getSeatsByEventId(Long eventId);
    SeatResponse getSeatById(Long id);
    SeatResponse updateSeat(Long id, SeatRequest seatRequest);
    // Usually admin might add seats in bulk, but let's implement basic add for now
    SeatResponse createSeat(Long eventId, SeatRequest seatRequest);
    List<SeatResponse> createSeatsBulk(Long eventId, List<SeatRequest> seatRequests);
}
