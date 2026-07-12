package com.ticketverse.service;

import com.ticketverse.dto.request.EventRequest;
import com.ticketverse.dto.response.EventResponse;

import java.util.List;

public interface EventService {
    EventResponse createEvent(EventRequest eventRequest);
    List<EventResponse> getAllEvents();
    EventResponse getEventById(Long id);
    EventResponse updateEvent(Long id, EventRequest eventRequest);
    void deleteEvent(Long id);
    List<String> getAllCategories();
}
