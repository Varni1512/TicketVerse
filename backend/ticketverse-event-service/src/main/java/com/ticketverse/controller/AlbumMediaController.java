package com.ticketverse.controller;

import com.ticketverse.dto.request.AlbumMediaRequest;
import com.ticketverse.dto.response.AlbumMediaResponse;
import com.ticketverse.service.AlbumMediaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/{eventId}/media")
@RequiredArgsConstructor
public class AlbumMediaController {

    private final AlbumMediaService albumMediaService;

    // Public endpoint to view media for an event
    @GetMapping
    public ResponseEntity<List<AlbumMediaResponse>> getMediaForEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(albumMediaService.getMediaForEvent(eventId));
    }

    // Admin endpoint to add media to an event
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<AlbumMediaResponse> addMediaToEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody AlbumMediaRequest request) {
        AlbumMediaResponse response = albumMediaService.addMediaToEvent(eventId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Admin endpoint to delete media
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{mediaId}")
    public ResponseEntity<String> deleteMedia(@PathVariable Long eventId, @PathVariable Long mediaId) {
        albumMediaService.deleteMedia(mediaId);
        return ResponseEntity.ok("Media deleted successfully");
    }
}
