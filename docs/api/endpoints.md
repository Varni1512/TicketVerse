# API Documentation

The TicketVerse API is accessible via the API Gateway on port `8080`.
All authenticated requests require a JWT token in the `Authorization: Bearer <token>` header.

## Authentication Service (`/api/auth`)

### `POST /api/auth/register`
Creates a new user account.
- **Body**: `{ "firstName": "John", "lastName": "Doe", "email": "john@example.com", "password": "SecurePass123!" }`
- **Response `200 OK`**: `{ "token": "jwt.token.string", "user": { ... } }`

### `POST /api/auth/login`
Authenticates a user and returns a JWT.
- **Body**: `{ "email": "john@example.com", "password": "SecurePass123!" }`
- **Response `200 OK`**: `{ "token": "jwt.token.string" }`

---

## Event Service (`/api/events`, `/api/seats`)

### `GET /api/events`
Fetches all events (optionally paginated).
- **Response `200 OK`**: `[{ "id": 1, "title": "Coldplay Live", "date": "...", "location": "Stadium", "imageUrl": "..." }]`

### `GET /api/events/{id}`
Fetches details for a specific event.

### `GET /api/events/{id}/seats`
Fetches all seats and their current status for a specific event.
- **Response `200 OK`**: `[{ "id": 100, "status": "AVAILABLE", "price": 50.00, "tier": "VIP" }]`

---

## Booking Service (`/api/bookings`)

### `POST /api/bookings`
Creates a new ticket booking. **(Requires Auth)**
- **Body**: `{ "eventId": 1, "seatIds": [100, 101] }`
- **Response `200 OK`**: `{ "id": 999, "totalAmount": 100.00, "status": "CONFIRMED" }`
- **Response `409 Conflict`**: `{ "message": "One or more seats are currently unavailable." }`

### `GET /api/bookings/my-bookings`
Fetches all bookings for the currently authenticated user. **(Requires Auth)**
- **Response `200 OK`**: `[{ "id": 999, "event": { ... }, "seats": [ ... ], "status": "CONFIRMED" }]`

---

## Standard Error Responses

The API uses standard HTTP status codes:
- `400 Bad Request`: Invalid input payloads.
- `401 Unauthorized`: Missing or invalid JWT.
- `403 Forbidden`: Authenticated, but lacking roles.
- `404 Not Found`: Resource does not exist.
- `409 Conflict`: Business logic conflict (e.g., duplicate booking).
- `500 Internal Server Error`: Generic server failure.
- `503 Service Unavailable`: Circuit breaker open (Resilience4j).
