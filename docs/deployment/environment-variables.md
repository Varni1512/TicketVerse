# Environment Variables Reference

This document lists every environment variable utilized across all 8 microservices and infrastructure components in TicketVerse. 

When deploying using Docker Compose (`docker-compose.prod.yml`), the `.env` file at the root of the project injects these variables into the containers.

## 1. Global / Infrastructure Variables

| Variable Name | Required | Default Value | Local Example | Production Example | Used By |
| --- | --- | --- | --- | --- | --- |
| `SPRING_PROFILES_ACTIVE` | No | *None* (defaults to local config) | `local` | `prod` | All Microservices |
| `SPRING_DATASOURCE_URL` | **Yes** | `jdbc:postgresql://localhost:5432/ticketverse...` | `jdbc:postgresql://localhost:5432/ticketverse` | `jdbc:postgresql://ep-xyz.us-east-2.aws.neon.tech/ticketverse` | Auth, Event, Booking, Contact, Notification, Analytics, Audit |
| `SPRING_DATASOURCE_USERNAME` | No | `postgres` | `postgres` | `ticketverse_admin` | Auth, Event, Booking, Contact, Notification, Analytics, Audit |
| `SPRING_DATASOURCE_PASSWORD` | No | `postgres` | `postgres` | `SuperSecretNeonPass123!` | Auth, Event, Booking, Contact, Notification, Analytics, Audit |
| `JWT_SECRET` | **Yes** | *Hardcoded local dev string* | *Any 256-bit string* | `c2VjcmV0LWtle...` (Base64 Encoded Secure Key) | Auth, Event, Booking, Contact |

## 2. Gateway Routing URLs
*Note: In `docker-compose.prod.yml`, these are automatically overridden to use internal Docker DNS (e.g. `http://auth-service:8080`). You rarely need to set these manually.*

| Variable Name | Required | Default Value | Local Example | Production Example | Used By |
| --- | --- | --- | --- | --- | --- |
| `AUTH_SERVICE_URL` | No | `http://localhost:8081` | `http://localhost:8081` | `http://auth-service:8080` | API Gateway |
| `EVENT_SERVICE_URL` | No | `http://localhost:8082` | `http://localhost:8082` | `http://event-service:8080` | API Gateway, Booking Service |
| `BOOKING_SERVICE_URL` | No | `http://localhost:8083` | `http://localhost:8083` | `http://booking-service:8080` | API Gateway |
| `CONTACT_SERVICE_URL` | No | `http://localhost:8084` | `http://localhost:8084` | `http://contact-service:8080` | API Gateway |

## 3. Distributed Cache & Lock (Redis)

| Variable Name | Required | Default Value | Local Example | Production Example | Used By |
| --- | --- | --- | --- | --- | --- |
| `REDIS_HOST` | No | `localhost` | `localhost` | `redis` (or AWS ElastiCache URL) | Event, Booking |
| `REDIS_PORT` | No | `6379` | `6379` | `6379` | Event, Booking |
| `REDIS_PASSWORD` | No | `ticketverse_redis_secret` | `ticketverse_redis_secret` | `ProdRedisSecureKey99!` | Event, Booking |

## 4. Message Broker (Apache Kafka)

| Variable Name | Required | Default Value | Local Example | Production Example | Used By |
| --- | --- | --- | --- | --- | --- |
| `SPRING_KAFKA_BOOTSTRAP_SERVERS` (or `KAFKA_BROKERS`) | No | `localhost:9092` | `localhost:9092` | `kafka:29092` (or Confluent Cloud URL) | Booking, Notification, Analytics, Audit |

## 5. Third-Party Integrations (Cloudinary)

| Variable Name | Required | Default Value | Local Example | Production Example | Used By |
| --- | --- | --- | --- | --- | --- |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | *None* | `my_cloud_name` | `dxc3abcde` | Event Service |
| `CLOUDINARY_API_KEY` | **Yes** | *None* | `1234567890` | `987654321012345` | Event Service |
| `CLOUDINARY_API_SECRET` | **Yes** | *None* | `abc123xyz` | `aBcD123XyZ_SecretKey` | Event Service |

## 6. Distributed Tracing (Zipkin)

| Variable Name | Required | Default Value | Local Example | Production Example | Used By |
| --- | --- | --- | --- | --- | --- |
| `MANAGEMENT_ZIPKIN_TRACING_ENDPOINT` | No | `http://localhost:9411/api/v2/spans` | `http://localhost:9411/api/v2/spans` | `http://zipkin:9411/api/v2/spans` | All Microservices |

---
*Note: Service port variables (`PORT_AUTH`, `PORT_EVENT`, etc.) exist as optional overrides in `application.yml` files (defaulting to 8081, 8082, etc.), but are ignored in the Docker Compose environment since all microservice containers expose internally on `8080`.*
