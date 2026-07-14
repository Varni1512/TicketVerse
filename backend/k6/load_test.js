import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

export const options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '20s', target: 100 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], 
    http_req_duration: ['p(95)<500'],
  },
};

const BASE_URL = 'http://localhost:8080';

// We need a test user. Assume user1@example.com exists with password 'password'
export function setup() {
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'user1@example.com',
    password: 'password'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const token = loginRes.json('token');
  return { token };
}

export default function (data) {
  const token = data.token;
  
  // Choose random seat IDs between 1 and 100
  const seatId = Math.floor(Math.random() * 100) + 1;
  const payload = JSON.stringify({
    eventId: 1,
    seatIds: [seatId]
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  };

  const res = http.post(`${BASE_URL}/api/bookings`, payload, params);
  
  check(res, {
    'is status 200 or 409 (conflict)': (r) => r.status === 200 || r.status === 409,
  });

  sleep(1);
}
