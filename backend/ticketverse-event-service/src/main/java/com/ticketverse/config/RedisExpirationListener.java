package com.ticketverse.config;

import com.ticketverse.event.DomainEvent;
import com.ticketverse.event.SeatUnlockedPayload;
import com.ticketverse.entity.Seat;
import com.ticketverse.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisExpirationListener implements MessageListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final SeatRepository seatRepository;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String expiredKey = new String(message.getBody());
        
        if (expiredKey.startsWith("seat_lock:")) {
            try {
                Long seatId = Long.parseLong(expiredKey.split(":")[1]);
                
                // Fetch seat to get eventId
                seatRepository.findById(seatId).ifPresent(seat -> {
                    // It expired, meaning the booking either crashed or took too long!
                    // Note: If the booking was successful, the lock is explicitly deleted (del), which does NOT trigger 'expired'.
                    // So if we get here, it means it's an auto-unlock.
                    
                    SeatUnlockedPayload payload = new SeatUnlockedPayload(seat.getEvent().getId(), seatId);
                    DomainEvent<SeatUnlockedPayload> wsEvent = DomainEvent.create(
                            "SEAT_UNLOCKED", 
                            UUID.randomUUID().toString(), 
                            "ticketverse-event-service", 
                            payload, 
                            null
                    );
                    
                    String destination = "/topic/events/" + seat.getEvent().getId() + "/seats";
                    messagingTemplate.convertAndSend(destination, wsEvent);
                    log.info("Broadcasted SEAT_UNLOCKED via Redis expiration for seat {}", seatId);
                });
                
            } catch (Exception e) {
                log.error("Failed to process Redis expiration for key {}", expiredKey, e);
            }
        }
    }
}
