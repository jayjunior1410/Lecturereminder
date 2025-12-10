# Lecture Reminder System

Overview
- Full-stack app: Node.js/Express backend + MongoDB (Mongoose) + Socket.IO; React frontend.
- Roles: student, lecturer, admin.
- Pages: Student page, Lecturer page, Registration (student/lecturer), Login, Admin page, Lecture reminder page, Logout.
- Notifications: reminders are persisted and delivered via Socket.IO; both students and lecturers receive reminders.

Quick start (local)
1. Install MongoDB and run it locally or use a MongoDB Atlas URI.
2. Backend
   - cd backend
   - cp .env.example .env (edit MONGO_URI and JWT_SECRET)
   - npm install
   - npm run dev
3. Frontend
   - cd frontend
   - npm install
   - npm start

Main endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/users (admin only)
- GET /api/reminders (auth)
- POST /api/reminders (auth)
- PUT /api/reminders/:id/read (auth)

Notes
- Role-based middleware enforces who can access what.
- Socket.IO namespace emits `reminder` events to connected clients.
- Extendable: email/SMS integrations, calendar sync, recurring reminders.

Next steps
- Wire UI to backend (CORS / env).
- Add styling and validation.
- Add tests and CI/CD.
