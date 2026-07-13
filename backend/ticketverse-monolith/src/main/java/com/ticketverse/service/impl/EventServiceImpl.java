package com.ticketverse.service.impl;

import com.ticketverse.dto.request.EventRequest;
import com.ticketverse.dto.response.EventResponse;
import com.ticketverse.entity.Event;
import com.ticketverse.exception.ResourceNotFoundException;
import com.ticketverse.mapper.EventMapper;
import com.ticketverse.repository.EventRepository;
import com.ticketverse.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Override
    @Transactional
    public EventResponse createEvent(EventRequest eventRequest) {
        Event event = eventMapper.mapToEntity(eventRequest);
        Event savedEvent = eventRepository.save(event);
        return eventMapper.mapToResponse(savedEvent);
    }

    @Override
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        return eventMapper.mapToResponse(event);
    }

    @Override
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(eventMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EventResponse updateEvent(Long id, EventRequest eventRequest) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));

        eventMapper.updateEntity(event, eventRequest);
        Event updatedEvent = eventRepository.save(event);
        return eventMapper.mapToResponse(updatedEvent);
    }

    @Override
    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        eventRepository.delete(event);
    }

    @Override
    public List<String> getAllCategories() {
        return eventRepository.findDistinctCategories();
    }
}
