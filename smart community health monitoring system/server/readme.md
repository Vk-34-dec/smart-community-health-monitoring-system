# SIH Server

Simple Node/Express backend skeleton for the Smart Community Health project.

Quick start

1. Copy `.env.example` to `.env` and update `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:

```bash
cd server
npm install
```

3. Run in development:

```bash
npm run dev
```

API endpoints

- `POST /api/auth/register` { name, email, password, role }
- `POST /api/auth/login` { email, password }

Patient API (protected - requires `Authorization: Bearer <token>`)

- `GET /api/patients` - list patients
- `POST /api/patients` - create patient { name, age, gender, contact, address }
- `GET /api/patients/:id` - get patient
- `PUT /api/patients/:id` - update patient
- `DELETE /api/patients/:id` - remove patient
