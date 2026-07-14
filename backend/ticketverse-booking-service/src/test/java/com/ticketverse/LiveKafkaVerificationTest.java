package com.ticketverse;

import com.ticketverse.event.BookingCreatedPayload;
import com.ticketverse.event.DomainEvent;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.KafkaTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@SpringBootTest
public class LiveKafkaVerificationTest {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Test
    public void publishLiveEvent() throws Exception {
        BookingCreatedPayload payload = BookingCreatedPayload.builder()
                .bookingId(999L)
                .userId(1L)
                .eventId(1L)
                .seatIds(Arrays.asList(100L, 101L))
                .bookingTime(LocalDateTime.now())
                .totalAmount(new BigDecimal("1000.00"))
                .status("CONFIRMED")
                .build();

        DomainEvent<BookingCreatedPayload> domainEvent = 
                DomainEvent.create("BOOKING_CREATED", "live-test-correlation-123", "ticketverse-booking-service", payload, null);

        kafkaTemplate.send("booking-created-topic", "999", domainEvent).get();
        System.out.println("Message published successfully to live Kafka!");
    }
}
