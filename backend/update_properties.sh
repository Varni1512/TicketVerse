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
    
    # Check if we already added management config
    if ! grep -q "management:" "$FILE"; then
        echo -e "\nmanagement:\n  endpoints:\n    web:\n      exposure:\n        include: health,info,prometheus\n  endpoint:\n    health:\n      show-details: always\n      probes:\n        enabled: true\n  metrics:\n    tags:\n      application: \${spring.application.name}\n    distribution:\n      percentiles-histogram:\n        http.server.requests: true\n  tracing:\n    sampling:\n      probability: 1.0\n\nlogging:\n  level:\n    com.ticketverse: INFO" >> "$FILE"
        echo "Updated $FILE with management metrics"
    fi
done
