#!/bin/bash
# stop-all.sh - Stops all TicketVerse microservices

# Ensure we are in the backend directory
cd "$(dirname "$0")"

SERVICES=(
  "ticketverse-auth-service"
  "ticketverse-event-service"
  "ticketverse-booking-service"
  "ticketverse-contact-service"
  "ticketverse-gateway"
)

echo "🛑 Stopping TicketVerse Microservices..."

PORTS=(8080 8081 8082 8083 8084)

for PORT in "${PORTS[@]}"; do
  PID=$(lsof -ti:$PORT)
  if [ ! -z "$PID" ]; then
    echo "Killing process on port $PORT (PID: $PID)..."
    kill -9 $PID 2>/dev/null
  else
    echo "  -> No process running on port $PORT."
  fi
done

# Cleanup old pid files just in case
rm -f *.pid

echo "✅ All local background services have been stopped!"
