# System Design & Architecture

## 1. System Architecture Diagram (Mermaid)

```mermaid
graph TD
    User((User/Patient)) -->|Mobile App/Web| Frontend[Frontend - HTML/CSS/JS]
    Doctor((Doctor/Admin)) -->|Web Dashboard| Frontend
    
    Frontend -->|API Requests| Backend[Backend - Node.js/Express]
    Backend -->|Query/Update| DB[(MongoDB)]
    
    IoT[IoT Sensors - Heart Rate/Temp] -->|REST API| Backend
    
    Backend -->|Features| AI[AI Engine - Python/ML]
    AI -->|Predictions| Backend
    
    Backend -->|Notify| Alerts[Alert System - SMS/Email]
```

## 2. Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USER {
        string user_id PK
        string name
        string email
        string role "patient, doctor, admin"
        string password_hash
    }
    PATIENT_DATA {
        string data_id PK
        string user_id FK
        float heart_rate
        float spo2
        float temperature
        datetime timestamp
    }
    APPOINTMENT {
        string appt_id PK
        string patient_id FK
        string doctor_id FK
        datetime schedule
        string status
    }
    HEALTH_RECORD {
        string record_id PK
        string patient_id FK
        string diagnosis
        string prescription
    }
    ALERT {
        string alert_id PK
        string user_id FK
        string type "emergency, high_bp, etc."
        string message
        datetime created_at
    }

    USER ||--o{ PATIENT_DATA : has
    USER ||--o{ APPOINTMENT : books
    USER ||--o{ HEALTH_RECORD : owns
    USER ||--o{ ALERT : receives
```

## 3. Database Schema (MongoDB Collections)

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "Vignesh",
  "email": "vignesh@example.com",
  "password": "hashed_password",
  "role": "admin",
  "profile": {
    "age": 30,
    "gender": "male",
    "location": "Chennai"
  }
}
```

### HealthData Collection
```json
{
  "_id": "ObjectId",
  "patient_id": "ObjectId",
  "vitals": {
    "heart_rate": 72,
    "spo2": 98,
    "temp": 36.6
  },
  "timestamp": "2023-10-27T10:00:00Z"
}
```

### Appointments Collection
```json
{
  "_id": "ObjectId",
  "patient_id": "ObjectId",
  "doctor_id": "ObjectId",
  "date": "2023-10-28T11:00:00Z",
  "status": "confirmed"
}
```
