# Online Complaint Registration and Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for submitting,
tracking, and resolving complaints through a centralized, role-based platform.

🔗 **Demo Link:** _add your deployed app link here (e.g. Vercel/Render/Netlify URL)_
🔗 **GitHub Repository:** _add your GitHub repo link here_

## Features

- Secure JWT-based authentication (Register/Login)
- Role-based access: `user`, `agent`, `admin`
- Submit complaints with category & priority
- Real-time status tracking (Open, In Progress, Resolved, Closed, Rejected)
- Agent assignment by admin
- Comment thread for complainant-agent communication
- Complaint deletion with permission checks

## Tech Stack

- **Frontend:** React.js, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JSON Web Tokens (JWT), bcrypt password hashing

## Project Structure

```
complaint-management-system/
├── backend/
│   ├── config/db.js
│   ├── models/User.js
│   ├── models/Complaint.js
│   ├── middleware/auth.js
│   ├── routes/authRoutes.js
│   ├── routes/complaintRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.js
    │   ├── components/Navbar.js
    │   ├── components/ProtectedRoute.js
    │   ├── pages/Home.js
    │   ├── pages/Login.js
    │   ├── pages/Register.js
    │   ├── pages/Dashboard.js
    │   ├── pages/SubmitComplaint.js
    │   ├── pages/ComplaintDetail.js
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env.example
```

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm start
```
The API will run on `http://localhost:5000` by default.

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if your backend runs on a different URL
npm start
```
The React app will run on `http://localhost:3000` by default.

### 3. Default User Roles

New registrations default to the `user` role. To create an `agent` or `admin`
account, register normally, then manually update the `role` field for that
user document in MongoDB (e.g. via MongoDB Compass or the mongo shell):

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## API Overview

| Method | Endpoint                          | Description                       | Access         |
|--------|------------------------------------|------------------------------------|----------------|
| POST   | /api/auth/register                 | Register a new user                | Public         |
| POST   | /api/auth/login                    | Login and receive JWT              | Public         |
| GET    | /api/auth/me                       | Get current user profile           | Authenticated  |
| POST   | /api/complaints                    | Submit a complaint                 | Authenticated  |
| GET    | /api/complaints                    | List complaints                    | Authenticated  |
| GET    | /api/complaints/:id                | Get complaint details              | Authenticated  |
| PUT    | /api/complaints/:id/status         | Update complaint status            | Agent/Admin    |
| PUT    | /api/complaints/:id/assign         | Assign an agent to a complaint     | Admin          |
| POST   | /api/complaints/:id/comments       | Add a comment to a complaint       | Authenticated  |
| DELETE | /api/complaints/:id                | Delete a complaint                 | Owner/Admin    |

## Deployment Notes (for adding your Demo link)

- **Backend:** Deploy to Render, Railway, or Cyclic, and set `MONGO_URI`,
  `JWT_SECRET`, and `CLIENT_URL` environment variables.
- **Frontend:** Deploy to Vercel or Netlify, and set `REACT_APP_API_URL`
  to point to your deployed backend URL.
- **Database:** Use MongoDB Atlas for a free cloud-hosted database.

Once deployed, update the Demo and GitHub links at the top of this README
and in your team's Kanban/workspace board so your mentor can review the project.

## License
This project is provided for educational purposes.
