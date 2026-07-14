# Deployment & Upgrade Guide

TicketVerse is built using Docker, making it completely cloud-agnostic. You can deploy this on AWS EC2, DigitalOcean Droplets, Azure VMs, or a local server.

## Prerequisites
- Docker (v24+)
- Docker Compose (v2+)
- 4GB+ RAM recommended (for running the entire stack)

## Environment Variables
Before deploying, create a `.env` file in the root directory. Use `.env.example` as a template.

### External Dependencies
TicketVerse assumes you are using managed services for the Database and Media hosting to ensure stateless microservices:
1. **Neon PostgreSQL**: Add your connection string to `SPRING_DATASOURCE_URL`.
2. **Cloudinary**: Add your API keys for event image uploads.
3. **JWT Secret**: Generate a secure Base64 JWT secret for `JWT_SECRET`.

## Running the Production Stack

We provide a `docker-compose.prod.yml` which wires together:
- Redis (Distributed Caching & Locking)
- Apache Kafka (Message Broker & Zookeeper)
- Prometheus & Grafana (Observability)
- Zipkin (Distributed Tracing)
- 8 Spring Boot Microservices
- React + Vite Frontend (served via Nginx)

To start the stack in detached mode:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Health Checks
Docker Compose is configured to verify container health. You can check the status of all services:
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Accessing the Applications
- **Frontend App**: `http://<your-server-ip>:80`
- **API Gateway**: `http://<your-server-ip>:8080`
- **Grafana Dashboards**: `http://<your-server-ip>:3000` (Default login: `admin` / `admin`)
- **Prometheus Metrics**: `http://<your-server-ip>:9090`
- **Zipkin Traces**: `http://<your-server-ip>:9411`

## Scaling
To handle high traffic, you can scale stateless microservices (e.g., Booking Service).
```bash
docker-compose -f docker-compose.prod.yml up -d --scale ticketverse-booking-service=3
```
*Note: The Event Service utilizes in-memory WebSockets. Scaling the Event Service beyond 1 instance requires configuring an external STOMP broker (see Future Roadmap).*

## Upgrade Guide (v1.x)
1. Pull the latest repository changes.
2. If new dependencies were added, rebuild the specific images:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```
3. Restart the updated services (zero-downtime is achievable using blue-green deployments, but natively via compose):
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Git History and Cleanups
If you wish to deploy a clean slate and hide the development history (squash), you can run:
```bash
git checkout --orphan latest_branch
git add -A
git commit -m "chore: initial production release v1.0.0"
git branch -D main
git branch -m main
git push -f origin main
```
*Note: This will overwrite remote history permanently. Otherwise, retain history as it showcases the iterative engineering process.*
