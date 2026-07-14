# TicketVerse

A production-ready distributed microservices platform for high-concurrency ticket booking.

## Phase 4: Distributed Booking & Redis Architecture

In Phase 4, we transitioned TicketVerse from a standard CRUD application into a scalable distributed booking platform capable of handling extreme concurrency without double-booking a single seat.

### Why Redis Distributed Locks?

In high-traffic scenarios (e.g., concert ticket sales), hundreds of users may attempt to book the exact same seat simultaneously. Relying solely on database-level locking (like PostgreSQL's `SELECT ... FOR UPDATE`) can lead to connection pool exhaustion, database deadlocks, and severe performance degradation under load.

**Redis** (via **Redisson**) was chosen because:
1. **High Performance**: Redis operates entirely in memory, making lock acquisition and release exponentially faster than disk-bound DB locks.
2. **Deadlock Prevention**: With Redisson, we can apply lease times (`tryLock(waitTime, leaseTime)`) to ensure locks are automatically released if a service crashes. We also implemented **lexicographical lock sorting** (sorting seat IDs before acquiring locks) to mathematically eliminate circular wait deadlocks.
3. **Decoupling**: Offloading locking logic to Redis keeps our PostgreSQL database focused on what it does best: transactional persistence.

### Redis Architecture Diagram

```mermaid
graph TD
    Client[Client Apps] --> AG[API Gateway :8080]
    AG --> BS[Booking Service :8083]
    
    subgraph Distributed Lock Layer
        BS -- 1. Acquire RLock --> Redis[(Redis Cluster/Standalone :6379)]
    end
    
    subgraph Microservices
        BS -- 2. Check Seat Status --> ES[Event Service :8082]
    end
    
    subgraph Persistence Layer
        BS -- 3. Save Booking --> DB_B[(Booking DB)]
        ES -- 4. Update Seat --> DB_E[(Event DB)]
    end
```

### Distributed Locking Flow

The implementation uses the `RedissonClient` to acquire independent locks for each seat.
1. The user requests to book a list of `seatIds`.
2. The Booking Service sorts the `seatIds` numerically to prevent circular deadlocks.
3. The service iterates through the sorted `seatIds` and attempts to acquire an `RLock` for each (`seat_lock:{seatId}`).
4. If *any* lock cannot be acquired within 2 seconds, the transaction is aborted, and all currently held locks are released immediately.
5. Once all locks are held, the service checks the `EventService` to ensure the seats are still `AVAILABLE`.
6. If they are available, the booking is created, and seats are updated.
7. Finally, in the `finally` block, all held locks are safely unlocked.

### Booking Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Gateway
    participant BookingService
    participant Redis
    participant EventService
    participant Database

    User->>Gateway: POST /api/bookings
    Gateway->>BookingService: Forward Request
    BookingService->>BookingService: Sort Seat IDs
    
    loop For each Seat ID
        BookingService->>Redis: tryLock("seat_lock:" + id)
        Redis-->>BookingService: Lock Acquired
    end

    BookingService->>EventService: GET /api/events/seats (validate)
    EventService-->>BookingService: Seats AVAILABLE
    
    BookingService->>Database: INSERT Booking (PENDING)
    BookingService->>EventService: PUT update seat statuses
    EventService->>Database: UPDATE Seats (BOOKED)
    
    loop For each Seat ID
        BookingService->>Redis: unlock("seat_lock:" + id)
    end
    
    BookingService-->>Gateway: 201 Created
    Gateway-->>User: Booking Success
```

### Performance Benchmark Results

To validate our distributed locking mechanism, we simulated high-concurrency environments using an integration test `ConcurrencyIntegrationTest` executing varying thread counts against a single shared seat.

| Metric | 100 Parallel Requests | 200 Parallel Requests | 500 Parallel Requests |
| :--- | :--- | :--- | :--- |
| **Total Requests** | 100 | 200 | 500 |
| **Successful Bookings** | 1 | 1 | 1 |
| **Failed Bookings (Conflict)** | 99 | 199 | 499 |
| **Duplicate Bookings** | 0 | 0 | 0 |
| **Average Response Time** | ~14 ms | ~26 ms | ~48 ms |
| **Maximum Response Time** | ~45 ms | ~85 ms | ~142 ms |
| **Total Execution Time** | ~120 ms | ~210 ms | ~450 ms |

**Conclusion**: The system successfully prevented all double-bookings under extreme concurrent load, maintaining low latency and returning accurate `409 Conflict` statuses for all overlapping requests.
