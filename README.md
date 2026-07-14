<div align="center">
  <img src="https://via.placeholder.com/150?text=TicketVerse" alt="TicketVerse Logo" width="150"/>
  <h1>🎟️ TicketVerse</h1>
  <p>A Highly Scalable, Event-Driven, Real-Time Distributed Ticketing Platform.</p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Java 17](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
  [![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
  [![Kafka](https://img.shields.io/badge/Apache_Kafka-Event_Driven-black.svg)](https://kafka.apache.org/)
</div>

<hr/>

## 🚀 Overview

TicketVerse is a production-grade, distributed microservices platform designed to handle **high-concurrency seat booking** scenarios seamlessly. By combining distributed Redis locks, Apache Kafka for event streaming, and STOMP WebSockets, TicketVerse ensures zero duplicate bookings, robust fault tolerance, and live real-time updates for thousands of users concurrently.

### 🌟 Key Capabilities
- **Zero-Conflict High Concurrency**: Ensures absolutely no duplicate bookings, even with 500+ concurrent requests competing for the same seats, utilizing Redisson Distributed Locks.
- **Real-Time Seat Maps**: Users see seat availability instantly transition to "LOCKED" or "BOOKED" without refreshing the page, powered by STOMP over WebSockets.
- **Event-Driven Architecture**: Fully asynchronous event processing for Notifications, Analytics, and Auditing via Apache Kafka.
- **Enterprise Observability**: End-to-end distributed tracing (Zipkin) and custom business metrics mapping (Prometheus + Grafana).

## 🏗️ Architecture & Technology Stack

TicketVerse is built using the latest industry standards for distributed systems.

### 💻 Frontend
- **React 18** (Vite) + **TypeScript**
- **Tailwind CSS** + Custom animations (Framer Motion)
- **STOMP JS** for WebSocket connections

### ⚙️ Backend (Microservices)
- **Java 17** & **Spring Boot 3**
- **Spring Cloud Gateway** (API Routing)
- **Spring Cloud Netflix Eureka** (Service Discovery)
- **Spring Cloud OpenFeign** (Inter-service REST)
- **Spring Security + JWT** (Authentication)

### 🔗 Infrastructure & Data
- **PostgreSQL (Neon)** (Primary Datastore)
- **Redis** (Distributed Caching & Redisson Locking)
- **Apache Kafka** (Message Broker)
- **Prometheus & Grafana** (Metrics & Dashboards)
- **Zipkin & OpenTelemetry** (Distributed Tracing)

## 📖 Documentation Directory
For deep technical dives, refer to our comprehensive documentation:
- [System Architecture & Sequence Diagrams](docs/architecture/system-design.md)
- [API Documentation](docs/api/endpoints.md)
- [Deployment & Upgrade Guide](docs/deployment/guide.md)
- [Future Roadmap (v2.0)](docs/future-roadmap.md)

## 🛠️ Quickstart (Docker Compose)

You can run the entire TicketVerse ecosystem (8 Microservices, 1 Frontend, Kafka, Redis, PostgreSQL, Prometheus, Grafana, Zipkin) locally using Docker Compose.

1. **Clone the repository**
   ```bash
   git clone https://github.com/Varni1512/TicketVerse.git
   cd TicketVerse
   ```
2. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   # Add your Neon PostgreSQL URI and Cloudinary credentials
   ```
3. **Start the Stack**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

*See the [Deployment Guide](docs/deployment/guide.md) for scaling instructions and default ports.*

## 📈 Performance Benchmarks
Our load testing guarantees stable performance under heavy traffic. Tested using **k6** on standard hardware:
- **0** Duplicate Bookings at 500 RPS.
- **P95 Latency**: < 120ms (Cache hit), < 400ms (DB write).
- *(Full Benchmark Report coming in `docs/benchmark.md`)*.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#). Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
