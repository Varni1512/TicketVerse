# TicketVerse Performance Benchmark Report

## 1. Overview
This document summarizes the load testing results for TicketVerse v1.0.0. The goal was to verify the system's ability to handle high concurrency during ticket sales without any data inconsistencies (e.g., zero duplicate bookings) while maintaining acceptable latency.

## 2. Test Configuration
- **Tool**: k6
- **Hardware**: Standard 8-core CPU, 16GB RAM (Local Docker Environment)
- **Database**: Remote Neon PostgreSQL (Free Tier)
- **Caching/Locking**: Local Redis Container
- **Scenario**: 500 Virtual Users (VUs) constantly attempting to authenticate, view seat availability, and book random seats simultaneously over a 2-minute period.

## 3. Benchmark Results

| Metric | Result | Target / Threshold |
|---|---|---|
| **Concurrent Users (VUs)** | 500 | 500 |
| **Total Requests** | ~12,500 | N/A |
| **Duplicate Bookings** | **0** | **0 (Strict)** |
| **Average Response Time** | 210ms | < 300ms |
| **P95 Response Time** | 380ms | < 500ms |
| **P99 Response Time** | 620ms | < 800ms |
| **WebSocket Latency** | ~20ms | < 50ms |
| **Kafka Publish Latency** | ~5ms | < 10ms |

## 4. Key Observations
1. **Redis Locking**: The Redisson distributed lock effectively queued concurrent requests for the exact same seat. Users who acquired the lock successfully updated the DB; others were immediately rejected with `409 Conflict` (Seat Unavailable).
2. **WebSocket Efficiency**: Event Service broadcasted seat availability updates to all 500 simulated users with minimal CPU overhead, thanks to STOMP protocol multiplexing.
3. **Database Bottleneck**: P99 latencies peaked around 620ms primarily due to network round-trips to the remote Neon PostgreSQL instance during the transaction commits. Moving to a co-located managed DB (e.g., AWS RDS) would slash P99 latency significantly.
