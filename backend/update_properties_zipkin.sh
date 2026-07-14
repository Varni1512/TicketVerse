#!/bin/bash
SERVICES=(
    "ticketverse-auth-service"
    "ticketverse-event-service"
    "ticketverse-booking-service"
    "ticketverse-contact-service"
    "ticketverse-gateway"
    "ticketverse-notification-service"
    "ticketverse-analytics-service"
    "ticketverse-audit-service"
)

for SERVICE in "${SERVICES[@]}"; do
    FILE="$SERVICE/src/main/resources/application.yml"
    
    if ! grep -q "management.zipkin.tracing.endpoint" "$FILE"; then
        echo -e "\nmanagement:\n  zipkin:\n    tracing:\n      endpoint: http://localhost:9411/api/v2/spans" >> "$FILE"
    fi
done

# Booking specific resilience
B_FILE="ticketverse-booking-service/src/main/resources/application.yml"
if ! grep -q "resilience4j" "$B_FILE"; then
    echo -e "\nresilience4j.circuitbreaker:\n  instances:\n    eventService:\n      registerHealthIndicator: true\n      slidingWindowSize: 10\n      permittedNumberOfCallsInHalfOpenState: 3\n      waitDurationInOpenState: 5s\n      failureRateThreshold: 50\nresilience4j.retry:\n  instances:\n    eventService:\n      maxRetryAttempts: 3\n      waitDuration: 500ms" >> "$B_FILE"
fi

# Gateway specific resilience
G_FILE="ticketverse-gateway/src/main/resources/application.yml"
if ! grep -q "resilience4j" "$G_FILE"; then
    echo -e "\nresilience4j.circuitbreaker:\n  instances:\n    backendServices:\n      registerHealthIndicator: true\n      slidingWindowSize: 20\n      failureRateThreshold: 50\n      waitDurationInOpenState: 10s\nresilience4j.timelimiter:\n  instances:\n    backendServices:\n      timeoutDuration: 5s" >> "$G_FILE"
fi

