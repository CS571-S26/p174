# BadgerRides 🦡

Carpooling app for UW Madison students. Post rides, find matches, split costs, and chat with your driver — all with your @wisc.edu account.

## Stack

- **Frontend:** React, Tailwind CSS, Vite, Socket.IO Client
- **Backend:** Node.js, Express, PostgreSQL, Prisma ORM, JWT Auth, Socket.IO

## Setup

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
cp .env.example .env   # fill in your DATABASE_URL and JWT_SECRET
npx prisma db push
npm run dev
```

## Environment Variables

See `backend/.env.example` for required config. You need a running PostgreSQL instance.
