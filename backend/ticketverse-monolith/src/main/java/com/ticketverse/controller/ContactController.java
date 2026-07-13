package com.ticketverse.controller;

import com.ticketverse.dto.request.ContactMessageRequest;
import com.ticketverse.dto.response.ContactMessageResponse;
import com.ticketverse.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    // Public endpoint for users to submit contact forms
    @PostMapping
    public ResponseEntity<ContactMessageResponse> submitMessage(@Valid @RequestBody ContactMessageRequest request) {
        ContactMessageResponse response = contactService.saveMessage(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Admin endpoint to view all messages
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<ContactMessageResponse>> getAllMessages() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }

    // Admin endpoint to delete a message
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMessage(@PathVariable Long id) {
        contactService.deleteMessage(id);
        return ResponseEntity.ok("Message deleted successfully");
    }
}
