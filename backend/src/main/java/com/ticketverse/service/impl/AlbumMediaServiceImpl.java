package com.ticketverse.service.impl;

import com.ticketverse.dto.request.AlbumMediaRequest;
import com.ticketverse.dto.response.AlbumMediaResponse;
import com.ticketverse.entity.AlbumMedia;
import com.ticketverse.entity.Event;
import com.ticketverse.exception.ApiException;
import com.ticketverse.repository.AlbumMediaRepository;
import com.ticketverse.repository.EventRepository;
import com.ticketverse.service.AlbumMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlbumMediaServiceImpl implements AlbumMediaService {

    private final AlbumMediaRepository albumMediaRepository;
    private final EventRepository eventRepository;

    @Override
    public AlbumMediaResponse addMediaToEvent(Long eventId, AlbumMediaRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found with id: " + eventId));

        AlbumMedia media = AlbumMedia.builder()
                .mediaUrl(request.getMediaUrl())
                .mediaType(request.getMediaType())
                .event(event)
                .build();

        AlbumMedia savedMedia = albumMediaRepository.save(media);
        return mapToResponse(savedMedia);
    }

    @Override
    public List<AlbumMediaResponse> getMediaForEvent(Long eventId) {
        // Validate if event exists
        if (!eventRepository.existsById(eventId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Event not found with id: " + eventId);
        }

        return albumMediaRepository.findByEventId(eventId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteMedia(Long id) {
        AlbumMedia media = albumMediaRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Media not found with id: " + id));
        albumMediaRepository.delete(media);
    }

    private AlbumMediaResponse mapToResponse(AlbumMedia entity) {
        return new AlbumMediaResponse(
                entity.getId(),
                entity.getMediaUrl(),
                entity.getMediaType(),
                entity.getCreatedAt()
        );
    }
}
