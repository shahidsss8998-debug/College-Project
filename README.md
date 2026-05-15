# College Hub - Full Stack College Portal

A modern, clean, and modular college portal built with React, Node.js, and MongoDB.

## 📦 Project Structure

- **frontend/**: React + Vite + Tailwind CSS
- **backend/**: Node.js + Express.js + MongoDB
- **database/**: MongoDB Schema Design References

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (Atlas or Local)

### Setup Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```
4. `npm start`

### Setup Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 🛠 Features
- **Auth**: Student and Admin roles with JWT.
- **Announcements**: Central hub for college updates.
- **Resource Hub**: Share and download study materials (notes, PYQs).
- **Dashboard**: User-specific view for students and admins.
