package com.ticketverse.service.impl;

import com.ticketverse.dto.request.ContactMessageRequest;
import com.ticketverse.dto.response.ContactMessageResponse;
import com.ticketverse.entity.ContactMessage;
import com.ticketverse.exception.ApiException;
import com.ticketverse.repository.ContactMessageRepository;
import com.ticketverse.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactMessageRepository repository;

    @Override
    public ContactMessageResponse saveMessage(ContactMessageRequest request) {
        ContactMessage message = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();
        
        ContactMessage saved = repository.save(message);
        return mapToResponse(saved);
    }

    @Override
    public List<ContactMessageResponse> getAllMessages() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteMessage(Long id) {
        ContactMessage message = repository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Message not found with id: " + id));
        repository.delete(message);
    }

    private ContactMessageResponse mapToResponse(ContactMessage entity) {
        return new ContactMessageResponse(
                entity.getId(),
                entity.getName(),
                entity.getEmail(),
                entity.getSubject(),
                entity.getMessage(),
                entity.getCreatedAt()
        );
    }
}
