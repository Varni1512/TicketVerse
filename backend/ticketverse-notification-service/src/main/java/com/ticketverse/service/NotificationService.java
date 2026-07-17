package com.ticketverse.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketverse.entity.ProcessedEvent;
import com.ticketverse.event.BookingCreatedPayload;
import com.ticketverse.event.DomainEvent;
import com.ticketverse.repository.ProcessedEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final ProcessedEventRepository processedEventRepository;
    private final ObjectMapper objectMapper;
    private final JavaMailSender mailSender;

    @KafkaListener(topics = "booking-created-topic", groupId = "notification-group")
    @Transactional
    public void consumeBookingCreatedEvent(String message) {
        try {
            // Spring Kafka might deserialize it as a LinkedHashMap. We convert it properly.
            DomainEvent<BookingCreatedPayload> event = objectMapper.readValue(message, new TypeReference<>() {});
            
            log.info("Received BookingCreatedEvent: correlationId={}", event.getCorrelationId());
            org.slf4j.MDC.put("correlationId", event.getCorrelationId());

            // 1. Idempotency Check
            Optional<ProcessedEvent> existingEvent = processedEventRepository.findById(event.getEventId());
            if (existingEvent.isPresent()) {
                log.warn("Event {} already processed. Ignoring duplicate.", event.getEventId());
                org.slf4j.MDC.clear();
                return;
            }

            // 2. Process Notification
            BookingCreatedPayload payload = event.getPayload();
            log.info("Sending confirmation email for booking {} to user {}", payload.getBookingId(), payload.getUserId());
            
            // Send confirmation email
            sendConfirmationEmail(payload);

            // 3. Mark as Processed (Exactly-once semantics via DB transaction)
            ProcessedEvent processedEvent = ProcessedEvent.builder()
                    .eventId(event.getEventId())
                    .processedAt(LocalDateTime.now())
                    .build();
            processedEventRepository.save(processedEvent);

            log.info("Notification successfully sent for booking {}", payload.getBookingId());

        } catch (Exception e) {
            log.error("Error processing booking-created-topic message: {}", e.getMessage());
            throw new RuntimeException("Failed to process message, triggering retry/DLQ", e);
        } finally {
            org.slf4j.MDC.clear();
        }
    }

    private void sendConfirmationEmail(BookingCreatedPayload payload) {
        if (payload.getUserEmail() == null) {
            log.warn("Cannot send email: User email is null for booking {}", payload.getBookingId());
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(payload.getUserEmail());
            message.setSubject("TicketVerse: Booking Confirmation");
            message.setText("Congratulations! Your booking (ID: " + payload.getBookingId() + ") is confirmed.\n"
                    + "Total Amount: ₹" + payload.getTotalAmount() + "\n"
                    + "Enjoy the event!");
            mailSender.send(message);
            log.info("Email sent successfully to {}", payload.getUserEmail());
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", payload.getUserEmail(), e.getMessage());
        }
    }
}
