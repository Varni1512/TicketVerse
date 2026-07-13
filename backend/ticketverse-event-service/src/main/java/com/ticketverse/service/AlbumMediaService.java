package com.ticketverse.service;

import com.ticketverse.dto.request.AlbumMediaRequest;
import com.ticketverse.dto.response.AlbumMediaResponse;

import java.util.List;

public interface AlbumMediaService {
    AlbumMediaResponse addMediaToEvent(Long eventId, AlbumMediaRequest request);
    List<AlbumMediaResponse> getMediaForEvent(Long eventId);
    void deleteMedia(Long id);
}
