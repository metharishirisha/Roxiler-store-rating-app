# Roxiler Store Rating Web App

## Project Description
A full-stack web application that allows users to submit ratings for stores. The app features role-based access control for System Administrators, Normal Users, and Store Owners. Built with React (frontend), Express.js (backend), and PostgreSQL (database) using Prisma ORM.

## Features
- User registration and login (JWT authentication)
- Role-based dashboards (Admin, User, Store Owner)
- Store listing, search, and details
- Users can rate stores and update their ratings
- Store owners can view ratings and average score for their stores
- Admins can manage users and stores, and view analytics

## Technologies Used
- **Frontend:** React, TypeScript, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT, bcrypt
- **Validation:** express-validator

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm
- PostgreSQL database (local or cloud, e.g., Neon, Supabase)

### 1. Clone the Repository
```
git clone https://github.com/metharishirisha/Roxiler-store-rating-app.git
cd Roxiler-store-rating-app
```

### 2. Backend Setup
```
cd backend
npm install
```
- Create a `.env` file in `/backend` with:
  ```
  PORT=5000
  DATABASE_URL=your_postgres_connection_string
  JWT_SECRET=your_secret_key
  ```
- Run Prisma migrations and generate client:
  ```
  npx prisma migrate dev --name init
  npx prisma generate
  ```
- Start the backend server:
  ```
  npm run dev
  ```

### 3. Frontend Setup
```
cd ../frontend
npm install
npm run dev
```
- The app will be available at `http://localhost:5173`

## API Documentation

### Auth
- `POST /api/auth/register` — Register user/owner
- `POST /api/auth/login` — Login and get JWT

### Users
- `GET /api/users/me` — Get current user
- `GET /api/users/:id` — Admin only
- `PATCH /api/users/:id` — Update user
- `DELETE /api/users/:id` — Admin only

### Stores
- `GET /api/stores` — List all stores
- `GET /api/stores/:id` — Store details
- `POST /api/stores` — Admin only
- `PUT /api/stores/:id` — Admin only
- `DELETE /api/stores/:id` — Admin only

### Ratings
- `POST /api/ratings` — Submit rating
- `PUT /api/ratings/:id` — Update rating
- `GET /api/ratings/my` — User's ratings
- `GET /api/ratings/store/:id` — Owner: ratings for store
- `GET /api/ratings/store/:id/average` — Owner: average rating

### Admin
- `GET /api/admin/stats` — Analytics
- `GET /api/admin/users` — List users by role
- `GET /api/admin/stores` — List stores with filters

## Database Schema (Prisma)
- **User:** id, name, email, password, address, role
- **Store:** id, name, email, address
- **Rating:** id, userId, storeId, rating

## Deployment
- Deploy backend (Render, Railway, Heroku, etc.)
- Deploy frontend (Vercel, Netlify, etc.)
- Set environment variables for production
- Update CORS in backend for deployed frontend URL

## License
MIT 
