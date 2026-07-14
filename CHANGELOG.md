# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-15

### Added
- **Modern React Frontend**: Fully responsive UI built with React, Vite, and Tailwind CSS.
- **Spring Boot Backend**: 8 decoupled microservices running on Java 17 and Spring Boot 3.
- **Microservices Architecture**: API Gateway, Eureka Naming Server, and fully distributed logic.
- **Distributed Locking & Caching**: Redisson-based distributed locks and Redis caching for high concurrency seat bookings without race conditions.
- **Event-Driven Architecture**: Apache Kafka integration for asynchronous processing of notifications, analytics, and audit logs.
- **Real-Time Communication**: WebSocket + STOMP integration to broadcast live seat lock statuses and availability changes.
- **Observability**: Complete Prometheus and Grafana dashboards with custom business metrics.
- **Distributed Tracing**: OpenTelemetry and Zipkin integration for full request lifecycle tracing.
- **Resilience**: Resilience4j Circuit Breakers, Retries, and TimeLimiters.
- **CI/CD**: GitHub Actions workflow for building, testing, and pushing Docker images to GHCR.
- **Docker**: Production-ready `docker-compose.prod.yml` and optimized multi-stage Dockerfiles.
