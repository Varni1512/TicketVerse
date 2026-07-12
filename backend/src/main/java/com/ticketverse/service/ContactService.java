package com.ticketverse.service;

import com.ticketverse.dto.request.ContactMessageRequest;
import com.ticketverse.dto.response.ContactMessageResponse;

import java.util.List;

public interface ContactService {
    ContactMessageResponse saveMessage(ContactMessageRequest request);
    List<ContactMessageResponse> getAllMessages();
    void deleteMessage(Long id);
}
