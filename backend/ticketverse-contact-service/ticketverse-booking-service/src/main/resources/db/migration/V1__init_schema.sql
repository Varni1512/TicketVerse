CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    booking_reference VARCHAR(100) NOT NULL UNIQUE,
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_status VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL
);
