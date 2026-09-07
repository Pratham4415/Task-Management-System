# TaskFlow — MERN Task Management System

A full-stack Task Manager built with MongoDB, Express.js, React.js, and Node.js. Users can register, log in, and manage personal tasks with full CRUD operations. Tasks are scoped per user with JWT-based authentication (access + refresh tokens).

## Features

- User registration & login with bcrypt password hashing
- JWT access token (15min) + refresh token (7-day HTTP-only cookie)
- Task CRUD — create, read, update, delete (user-scoped)
- Filter tasks by status (All / Pending / In-Progress / Done)
- Rate limiting on auth and API routes
- Helmet security headers
- Input validation (express-validator + client-side)
- Responsive dark-themed UI

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally or a MongoDB Atlas connection string
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-management-system
```

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm install
npm run dev
```

Server starts at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Client starts at `http://localhost:5173`

## Environment Variables

### Server (`/server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Secret key for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens |
| `NODE_ENV` | Environment mode (`development` or `production`) |
| `CLIENT_URL` | Frontend URL for CORS (default: `http://localhost:5173`) |

### Client (`/client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (default: `http://localhost:5000/api`) |

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout (clear refresh cookie) |

### Tasks (all protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for logged-in user |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task (owner only) |
| DELETE | `/api/tasks/:id` | Delete a task (owner only) |

## Tech Stack

- **Frontend**: React 19 (Vite), React Router v7, Axios, Context API
- **Backend**: Express.js, Mongoose, bcryptjs, jsonwebtoken
- **Database**: MongoDB
- **Security**: Helmet, express-rate-limit, HTTP-only cookies, CORS

## Assumptions & Limitations

- MongoDB must be running locally on default port (27017) or provide Atlas URI
- Refresh tokens are stored in HTTP-only cookies (not localStorage)
- No email verification or password reset implemented
- Single user role (no admin functionality)
