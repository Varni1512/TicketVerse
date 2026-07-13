#!/bin/bash
# start-all.sh - Starts all TicketVerse microservices

# Ensure we are in the backend directory
cd "$(dirname "$0")"

SERVICES=(
  "ticketverse-auth-service"
  "ticketverse-event-service"
  "ticketverse-booking-service"
  "ticketverse-contact-service"
  "ticketverse-gateway"
)

mkdir -p logs

echo "🚀 Starting TicketVerse Microservices..."

for SERVICE in "${SERVICES[@]}"; do
  echo "Starting $SERVICE..."
  
  # Run in a subshell to isolate environment variables
  (
    if [ -f "$SERVICE/.env" ]; then
      echo "  -> Loading .env file"
      # Export variables, ignoring comments
      export $(grep -v '^#' "$SERVICE/.env" | xargs)
    fi
    
    # Run maven and redirect output to log file
    ./mvnw spring-boot:run -pl "$SERVICE" > "logs/$SERVICE.log" 2>&1 &
    
    # Save the Process ID (PID)
    PID=$!
    echo $PID > "$SERVICE.pid"
    echo "  -> Started with PID $PID. Logs: logs/$SERVICE.log"
  )
done

echo "✅ All services have been launched in the background!"
echo "📝 You can view the logs in the backend/logs/ directory."
echo "🛑 Run ./stop-all.sh to stop all services."
