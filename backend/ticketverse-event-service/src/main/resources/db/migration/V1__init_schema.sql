CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    venue VARCHAR(255),
    city VARCHAR(100),
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    image_url VARCHAR(500),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE seats (
    id BIGSERIAL PRIMARY KEY,
    row_num VARCHAR(10) NOT NULL,
    seat_number INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    event_id BIGINT NOT NULL,
    booking_id BIGINT,
    CONSTRAINT fk_seat_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
);

CREATE TABLE album_media (
    id BIGSERIAL PRIMARY KEY,
    media_url VARCHAR(1000) NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    event_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_album_media_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
);
