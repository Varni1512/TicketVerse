package com.ticketverse.service.impl;

import com.ticketverse.dto.request.SeatRequest;
import com.ticketverse.dto.response.SeatResponse;
import com.ticketverse.entity.Event;
import com.ticketverse.entity.Seat;
import com.ticketverse.exception.ResourceNotFoundException;
import com.ticketverse.mapper.SeatMapper;
import com.ticketverse.repository.EventRepository;
import com.ticketverse.repository.SeatRepository;
import com.ticketverse.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;
    private final EventRepository eventRepository;
    private final SeatMapper seatMapper;

    @Override
    public List<SeatResponse> getSeatsByEventId(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event", "id", eventId);
        }
        return seatRepository.findByEventId(eventId).stream()
                .map(seatMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SeatResponse getSeatById(Long id) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seat", "id", id));
        return seatMapper.mapToResponse(seat);
    }

    @Override
    @Transactional
    public SeatResponse updateSeat(Long id, SeatRequest seatRequest) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seat", "id", id));
        
        seatMapper.updateEntity(seat, seatRequest);
        Seat updatedSeat = seatRepository.save(seat);
        return seatMapper.mapToResponse(updatedSeat);
    }

    @Override
    @Transactional
    public SeatResponse createSeat(Long eventId, SeatRequest seatRequest) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        Seat seat = seatMapper.mapToEntity(seatRequest, event);
        Seat savedSeat = seatRepository.save(seat);
        return seatMapper.mapToResponse(savedSeat);
    }

    @Override
    @Transactional
    public List<SeatResponse> createSeatsBulk(Long eventId, List<SeatRequest> seatRequests) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        List<Seat> seats = seatRequests.stream()
                .map(req -> seatMapper.mapToEntity(req, event))
                .collect(Collectors.toList());

        List<Seat> savedSeats = seatRepository.saveAll(seats);
        return savedSeats.stream()
                .map(seatMapper::mapToResponse)
                .collect(Collectors.toList());
    }
}
