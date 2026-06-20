# API Contract — Hospital Management System

Living document. Add new endpoints here as features are built. Both frontend
and backend must match these shapes exactly — if something needs to change,
update this file first, then tell the team.

## Conventions
- All request/response bodies are JSON.
- All fields are camelCase (e.g. `hospitalId`, not `hospital_id`).
- Auth token is sent as a header: `Authorization: Bearer <token>`
- Error format (any failed request):
  { "message": "Human-readable error description" }

## Auth

### POST /api/auth/login
Request:
{ "email": "doctor@hospital.com", "password": "test123" }

Response (200):
{
  "token": "string",
  "user": { "id": 1, "name": "Dr. Asha Mehta", "email": "doctor@hospital.com", "role": "doctor", "hospitalId": 1 }
}

Response (401): { "message": "Invalid credentials" }

### GET /api/auth/me
Headers: Authorization: Bearer <token>

Response (200):
{ "user": { "id": 1, "name": "Dr. Asha Mehta", "email": "doctor@hospital.com", "role": "doctor", "hospitalId": 1 } }

### POST /api/auth/logout
Response (200): { "message": "Logged out" }

## Coming soon (add as we build)
- /api/patients
- /api/doctors
- /api/appointments