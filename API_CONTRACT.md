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

## Patients

### GET /api/patients

Response (200)

```json
{
  "patients": [
    {
      "id": 1,
      "name": "Ravi Kumar",
      "age": 45,
      "gender": "male",
      "phone": "9876543210",
      "bloodGroup": "O+",
      "address": "Chennai",
      "status": "admitted",
      "hospitalId": 1
    }
  ]
}
```

### GET /api/patients/:id

Response (200)

```json
{
  "patient": {
    "id": 1,
    "name": "Ravi Kumar",
    "age": 45,
    "gender": "male",
    "phone": "9876543210",
    "bloodGroup": "O+",
    "address": "Chennai",
    "status": "admitted",
    "hospitalId": 1
  }
}
```

Response (404)

```json
{
  "message": "Patient not found"
}
```

### POST /api/patients

Request

```json
{
  "name": "string",
  "age": 0,
  "gender": "male|female|other",
  "phone": "string",
  "bloodGroup": "string",
  "address": "string",
  "status": "admitted|discharged|outpatient"
}
```

Response (201)

```json
{
  "patient": {
    "id": 3,
    "name": "string",
    "age": 0,
    "gender": "male|female|other",
    "phone": "string",
    "bloodGroup": "string",
    "address": "string",
    "status": "admitted|discharged|outpatient",
    "hospitalId": 1
  }
}
```
## Doctors

### GET /api/doctors
Response (200):
{ "doctors": [ { "id": 1, "name": "Dr. Asha Mehta", "specialty": "Cardiology", "phone": "9876512345", "email": "asha.mehta@hospital.com", "experience": 12, "status": "available", "hospitalId": 1 } ] }

### GET /api/doctors/:id
Response (200): { "doctor": { ...same shape } }
Response (404): { "message": "Doctor not found" }

### POST /api/doctors
Request: { "name": "string", "specialty": "string", "phone": "string", "email": "string", "experience": number, "status": "available|on-leave|in-surgery" }
Response (201): { "doctor": { ...same shape, with generated id } }

## Appointments

### GET /api/appointments
Response (200):
{ "appointments": [ { "id": 1, "patientId": 1, "patientName": "Ravi Kumar", "doctorId": 1, "doctorName": "Dr. Asha Mehta", "date": "2026-06-25", "time": "10:30", "reason": "Chest pain follow-up", "status": "scheduled", "hospitalId": 1 } ] }

### GET /api/appointments/:id
Response (200): { "appointment": { ...same shape } }
Response (404): { "message": "Appointment not found" }

### POST /api/appointments
Request: { "patientId": number, "doctorId": number, "date": "YYYY-MM-DD", "time": "HH:MM", "reason": "string", "status": "scheduled|completed|cancelled" }
Response (201): { "appointment": { ...same shape, with generated id } }


## Coming soon (add as we build)
- /api/patients
- /api/doctors
- /api/appointments