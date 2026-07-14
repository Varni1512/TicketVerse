# System Architecture & Design

## High Level Architecture

TicketVerse follows a microservices architecture communicating via a central API Gateway.

```mermaid
graph TD
    Client[Web Browser / React UI] --> |HTTP / WebSockets| Gateway(Spring Cloud Gateway :8080)
    Gateway --> Auth(Auth Service :8081)
    Gateway --> Event(Event Service :8082)
    Gateway --> Booking(Booking Service :8083)
    Gateway --> Contact(Contact Service :8084)
    
    Booking --> |gRPC / Feign| Event
    Event --> |STOMP Broadcast| Client
    
    Booking --> |Publish| Kafka(Apache Kafka)
    
    Kafka --> Notification(Notification Service)
    Kafka --> Analytics(Analytics Service)
    Kafka --> Audit(Audit Service)
    
    Booking <--> Redis[(Redis Lock & Cache)]
    Event <--> Redis
    
    Auth --> DB[(Neon PostgreSQL)]
    Event --> DB
    Booking --> DB
```

## Booking & Lock Sequence Flow (Concurrency Handling)

When multiple users attempt to book the same seat simultaneously, TicketVerse guarantees consistency using Redis Distributed Locks.

```mermaid
sequenceDiagram
    participant User
    participant Gateway
    participant BookingService
    participant Redis
    participant DB
    participant Kafka

    User->>Gateway: POST /api/bookings {seatIds: [100]}
    Gateway->>BookingService: Route Request
    
    BookingService->>Redis: tryLock("lock:seat:100", 1s, 5s)
    
    alt Lock Acquired
        BookingService->>DB: Check if seat 100 is "AVAILABLE"
        alt Seat is Available
            BookingService->>DB: Update seat status to "BOOKED"
            BookingService->>DB: Save Booking Record
            BookingService->>Kafka: Publish "BookingCreatedEvent"
            BookingService->>Redis: unlock("lock:seat:100")
            BookingService-->>User: 200 OK (Booking Confirmed)
        else Seat Already Booked
            BookingService->>Redis: unlock("lock:seat:100")
            BookingService-->>User: 409 Conflict (Seat unavailable)
        end
    else Lock Timeout
        BookingService-->>User: 409 Conflict (High traffic, try again)
    end
```

## WebSocket Real-time Broadcast Flow

When a seat's status changes, all users viewing that event page receive immediate updates.

```mermaid
sequenceDiagram
    participant UserA as User A (Browser)
    participant UserB as User B (Browser)
    participant WebSocket as Event Service (WebSocket)
    participant Kafka

    UserA->>WebSocket: Connect (STOMP over WS)
    UserA->>WebSocket: Subscribe /topic/events/1/seats
    UserB->>WebSocket: Connect (STOMP over WS)
    UserB->>WebSocket: Subscribe /topic/events/1/seats

    Kafka-->>WebSocket: Consume "SeatStatusChangedEvent"
    WebSocket->>UserA: Broadcast JSON (Seat 100 LOCKED)
    WebSocket->>UserB: Broadcast JSON (Seat 100 LOCKED)
```
