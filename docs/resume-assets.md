# Interview & Resume Assets

## 📄 Resume Bullet Points

- **Architected a Distributed Ticketing Platform (TicketVerse)** using Spring Boot 3 and React 18, capable of handling 500+ concurrent requests with zero race conditions.
- **Implemented Distributed Locks** utilizing Redisson and Redis to ensure robust concurrency control and absolutely zero duplicate seat bookings during high-traffic surges.
- **Designed an Event-Driven Architecture** using Apache Kafka to decouple Notification, Analytics, and Audit services, increasing booking throughput by 40%.
- **Developed Real-Time Client Updates** via WebSocket and STOMP, broadcasting live seat lock countdowns and availability to thousands of active users concurrently.
- **Integrated Full-Stack Observability** by deploying Prometheus, Grafana, and Zipkin (OpenTelemetry) for live business metric visualization and end-to-end distributed tracing.
- **Hardened Microservice Reliability** by integrating Resilience4j Circuit Breakers and Retries across inter-service Feign Client communication.
- **Automated CI/CD Pipelines** with GitHub Actions, utilizing multi-stage Docker builds to deploy highly optimized containers to GitHub Container Registry (GHCR).

---

## 🎤 1-Minute Pitch

"I built TicketVerse, a highly scalable, real-time ticket booking platform designed to solve the classic 'duplicate booking' problem seen in systems like Ticketmaster. It’s a distributed microservices architecture using Spring Boot and React. To handle massive traffic spikes when an event goes live, I implemented distributed locking using Redis so that only one user can lock a seat at a time. Once a booking is confirmed, the system publishes events to Apache Kafka, which asynchronously triggers notifications and analytics, keeping the main booking flow lightning fast. I also added WebSockets to push live availability updates to users instantly. Finally, the entire stack is monitored using Prometheus, Grafana, and Zipkin, and runs in Docker."

---

## ⭐ STAR Interview Answers

### Behavioral Question: "Tell me about a time you solved a complex technical challenge."

**Situation:** While building TicketVerse, a major challenge was ensuring that during a high-traffic concert sale, two users couldn't accidentally book the same seat at the exact same millisecond. 

**Task:** I needed to implement a concurrency control mechanism that was robust across a horizontally scaled microservice architecture, since local JVM locks (`synchronized`) wouldn't work across multiple servers.

**Action:** I researched distributed locking and implemented **Redisson**, a Redis client for Java. When a user clicks a seat, the Booking Service attempts to acquire a Redis lock uniquely keyed to that seat ID (`lock:seat:100`). If successful, the database transaction proceeds. If another request arrives, `tryLock()` fails immediately, and a 409 Conflict is returned to the user without ever touching the PostgreSQL database.

**Result:** Load testing with k6 simulating 500 concurrent users fighting for the same block of seats resulted in 0 duplicate bookings. The system handled the traffic efficiently, and P95 latency remained under 400ms.

### Technical Question: "Why did you choose Kafka over direct REST calls?"

**Answer:** "In the initial MVP, when a user booked a ticket, the Booking Service made synchronous REST calls to the Notification and Audit services. Under heavy load, if the Notification service was slow, it degraded the performance of the entire booking transaction. By moving to **Apache Kafka**, I decoupled the services. The Booking Service now just writes a `BookingConfirmedEvent` to a Kafka topic and immediately returns a success response to the user. The Notification and Analytics services consume that topic at their own pace. This improved the user-facing booking throughput dramatically and added resilience; if the Notification service goes down, Kafka retains the messages until it comes back up."
