ALTER TABLE seats
ADD COLUMN booking_id BIGINT,
ADD CONSTRAINT fk_seat_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE SET NULL;
