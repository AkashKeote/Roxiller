# 🚀 Quick Setup Guide - Store Rating System

## Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## ⚡ Quick Start

### 1. Database Setup
```bash
# Create PostgreSQL database
createdb store_ratings_db

# Navigate to server directory
cd server

# Install dependencies
npm install

# Initialize database with schema and sample data
npm run db:init
```

### 2. Environment Setup
Create `.env` file in `server/` directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_ratings_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
```

### 3. Start Application
```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm install
npm start
```

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **System Admin** | `admin@system.com` | `Admin@123` |
| **Normal User** | `user@example.com` | `User@123` |
| **Store Owner** | `store@example.com` | `Store@123` |

## 📱 Test the Application

1. **Login as Admin** → Add users and stores
2. **Login as Normal User** → Browse stores and submit ratings
3. **Login as Store Owner** → View store ratings and performance

## 🎯 Key Features to Demo

- ✅ User registration with validation
- ✅ Role-based login system
- ✅ Store management (Admin)
- ✅ Store browsing and search
- ✅ Rating system (1-5 stars)
- ✅ Admin dashboard with statistics
- ✅ Responsive design

## 🚨 Important Notes

- Change default passwords in production
- Update JWT_SECRET in production
- Database includes sample data for testing
- All form validations implemented as per requirements

---

**Ready for your internship presentation! 🎉**
