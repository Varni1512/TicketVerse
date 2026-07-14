# Future Roadmap (v2.0)

TicketVerse has reached a highly stable `v1.0.0` featuring distributed locking, real-time WebSockets, and Apache Kafka integration. 

Looking forward to `v2.0.0`, here are the planned architectural enhancements and business features:

## Architecture Enhancements
1. **External STOMP Broker**: Replace the in-memory Spring SimpleBroker with a dedicated RabbitMQ STOMP broker. This will allow the `Event Service` to scale horizontally out-of-the-box, ensuring users on different WebSocket server instances can subscribe to and receive the same STOMP messages.
2. **Kubernetes Deployment**: Migrate the `docker-compose.prod.yml` into a set of Helm charts for Kubernetes deployments, including auto-scaling based on Kafka consumer lag (KEDA).
3. **Database Sharding**: As the application grows, sharding the PostgreSQL Neon database at the tenant (event) level for better read/write distribution.
4. **Outbox Pattern**: Guarantee reliable event publishing even if Kafka is temporarily down, by implementing the Transactional Outbox pattern in the Booking Service.

## Business Features
1. **Payment Gateway Integration**: Integrate a real payment provider (Stripe/Razorpay) using asynchronous webhooks to confirm bookings.
2. **Dynamic Pricing (Yield Management)**: Introduce an analytics-driven pricing engine that increases ticket prices automatically when demand surges or availability drops below 20%.
3. **Seat Assignment Algorithms**: Introduce automatic "best available" seat assignments for users who don't want to manually pick seats on the map.
4. **QR Code Ticketing**: Generate and email QR codes for successful bookings, scannable at venue entry gates via a dedicated Venue-Scanner app.
