package com.ticketverse.config;

import com.ticketverse.event.DomainEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.security.Principal;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final StringRedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    
    private static final Pattern TOPIC_PATTERN = Pattern.compile("/topic/events/(\\d+)/.*");

    @EventListener
    public void handleSessionSubscribeEvent(SessionSubscribeEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String destination = headers.getDestination();
        String sessionId = headers.getSessionId();

        if (destination != null) {
            Matcher matcher = TOPIC_PATTERN.matcher(destination);
            if (matcher.matches()) {
                Long eventId = Long.parseLong(matcher.group(1));
                
                // Track in session attributes so we can remove on disconnect
                if (headers.getSessionAttributes() != null) {
                    headers.getSessionAttributes().put("eventId", eventId);
                }

                String userId = getUserIdOrSession(headers, sessionId);
                String redisKey = "event:" + eventId + ":presence";
                
                redisTemplate.opsForSet().add(redisKey, userId);
                redisTemplate.expire(redisKey, 2, TimeUnit.HOURS); // Auto expire just in case
                
                broadcastPresence(eventId, redisKey);
            }
        }
    }

    @EventListener
    public void handleSessionDisconnectEvent(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = headers.getSessionId();
        
        if (headers.getSessionAttributes() != null && headers.getSessionAttributes().containsKey("eventId")) {
            Long eventId = (Long) headers.getSessionAttributes().get("eventId");
            String userId = getUserIdOrSession(headers, sessionId);
            String redisKey = "event:" + eventId + ":presence";
            
            redisTemplate.opsForSet().remove(redisKey, userId);
            broadcastPresence(eventId, redisKey);
        }
    }

    private String getUserIdOrSession(SimpMessageHeaderAccessor headers, String sessionId) {
        Principal user = headers.getUser();
        if (user != null && user.getName() != null) {
            return user.getName(); // In Spring Security, this is usually the username or userId
        }
        return "anon:" + sessionId;
    }

    private void broadcastPresence(Long eventId, String redisKey) {
        Long count = redisTemplate.opsForSet().size(redisKey);
        if (count == null) count = 0L;
        
        UserPresencePayload payload = new UserPresencePayload(eventId, count);
        DomainEvent<UserPresencePayload> wsEvent = DomainEvent.create(
                "USER_PRESENCE_UPDATED", 
                UUID.randomUUID().toString(), 
                "ticketverse-event-service", 
                payload, 
                null
        );
        
        messagingTemplate.convertAndSend("/topic/events/" + eventId + "/presence", wsEvent);
    }
    
    public record UserPresencePayload(Long eventId, Long viewerCount) {}
}
