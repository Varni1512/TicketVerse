package com.ticketverse.mapper;

import com.ticketverse.dto.request.EventRequest;
import com.ticketverse.dto.response.EventResponse;
import com.ticketverse.entity.Event;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {

    public Event mapToEntity(EventRequest request) {
        return Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .venue(request.getVenue())
                .city(request.getCity())
                .eventDate(request.getEventDate())
                .startTime(request.getStartTime())
                .imageUrl(request.getImageUrl())
                .status(request.getStatus())
                .build();
    }

    public EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .category(event.getCategory())
                .venue(event.getVenue())
                .city(event.getCity())
                .eventDate(event.getEventDate())
                .startTime(event.getStartTime())
                .imageUrl(event.getImageUrl())
                .status(event.getStatus())
                .createdAt(event.getCreatedAt())
                .build();
    }

    public void updateEntity(Event event, EventRequest request) {
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setVenue(request.getVenue());
        event.setCity(request.getCity());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setImageUrl(request.getImageUrl());
        event.setStatus(request.getStatus());
    }
}
