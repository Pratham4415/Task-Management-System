# TaskFlow — MERN Task Management System

A full-stack Task Manager built with MongoDB, Express.js, React.js, and Node.js. Users can register, log in, and manage personal tasks with full CRUD operations. Tasks are scoped per user with JWT-based authentication stored in localStorage. Includes an admin panel for user and task management.

## Features

- User registration and login with bcrypt password hashing
- JWT authentication stored in localStorage (read on app initialization)
- Protected routes using PrivateRoute component (redirects to /login)
- Task CRUD — create, read, update, delete (user-scoped)
- Filter tasks by status (All / Pending / In-Progress / Done)
- Rate limiting on auth and API routes
- Helmet security headers
- Input validation (express-validator + client-side)
- Responsive dark-themed UI
- **Admin Panel** — manage users (CRUD) and view all tasks with filters

## Admin Login

An admin account is pre-seeded into the database:

| Field | Value |
|-------|-------|
| Email | `admin@taskflow.com` |
| Password | `Admin@123` |

Admin can:
- View all registered users
- Create, edit, and delete users
- View all tasks across all users
- Filter tasks by user and status

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally or a MongoDB Atlas connection string
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Pratham4415/Task-Management-System.git
cd Task-Management-System
```

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run seed     # Seeds the admin user into MongoDB
npm run dev      # Starts server at http://localhost:5000
```

### 3. Frontend Setup

```bash
cd client
cp .env.example .env
npm install
npm run dev      # Starts client at http://localhost:5173
```

## Environment Variables

### Server (`/server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `NODE_ENV` | Environment mode (`development` or `production`) |
| `CLIENT_URL` | Frontend URL for CORS (default: `http://localhost:5173`) |

### Client (`/client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (default: `http://localhost:5000/api`) |

## API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user, returns JWT |
| POST | `/api/auth/login` | No | Login user, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user profile |

### Tasks (all protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for logged-in user |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task (owner only) |
| DELETE | `/api/tasks/:id` | Delete a task (owner only) |

### Admin (protected, admin role only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| POST | `/api/admin/users` | Create a new user |
| PUT | `/api/admin/users/:id` | Update a user |
| DELETE | `/api/admin/users/:id` | Delete a user and their tasks |
| GET | `/api/admin/tasks` | Get all tasks (supports `?userId=` and `?status=` filters) |

## Project Structure

```
├── server/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, login, get profile
│   │   ├── taskController.js     # Task CRUD (user-scoped)
│   │   └── adminController.js    # Admin user/task management
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── adminMiddleware.js    # Admin role check
│   │   └── errorMiddleware.js    # Global error handler
│   ├── models/
│   │   ├── User.js               # User schema (name, email, password, role)
│   │   └── Task.js               # Task schema (title, desc, status, dueDate)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/generateToken.js    # JWT generation
│   ├── validators/validators.js  # Input validation rules
│   ├── seed.js                   # Admin user seeder
│   ├── server.js                 # Entry point
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── api/axios.js          # Axios with token interceptor
│   │   ├── context/AuthContext.jsx # Auth state (Context API)
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Login, Register, Dashboard, Admin
│   │   ├── App.jsx               # Router setup
│   │   └── index.css             # Design system
│   └── .env.example
├── .gitignore
└── README.md
```

## Tech Stack

- **Frontend**: React 19 (Vite), React Router v7, Axios, Context API
- **Backend**: Express.js, Mongoose, bcryptjs, jsonwebtoken
- **Database**: MongoDB
- **Security**: Helmet, express-rate-limit, JWT via localStorage, CORS, input validation

## Assumptions & Limitations

- MongoDB must be running locally on default port (27017) or provide Atlas URI in .env
- JWT is stored in localStorage as required by the assignment
- Admin account is created via the seed script (`npm run seed`)
- Deleting a user also deletes all their tasks
- No email verification or password reset implemented
- Single admin role (no granular permissions)
