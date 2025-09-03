# Store Rating System - FullStack Intern Coding Challenge

A web application that allows users to submit ratings for stores registered on the platform, with role-based access control.

## 🚀 Tech Stack

- **Backend**: Express.js with Node.js
- **Database**: PostgreSQL
- **Frontend**: React.js with Tailwind CSS
- **Authentication**: JWT tokens
- **Password Hashing**: bcryptjs

## 📋 Features

### System Administrator
- Add new stores, normal users, and admin users
- Dashboard with total counts (users, stores, ratings)
- View and filter all users and stores
- Manage user roles and permissions

### Normal User
- Sign up and login
- View all registered stores
- Search stores by name and address
- Submit ratings (1-5 stars) for stores
- Update password

### Store Owner
- Login and manage store
- View ratings submitted for their store
- See average store rating
- Update password

## 🗄️ Database Schema

### Users Table
- `id` (Primary Key)
- `name` (20-60 characters)
- `email` (Unique)
- `password_hash`
- `address` (Max 400 characters)
- `role` (system_admin, normal_user, store_owner)
- `created_at`, `updated_at`

### Stores Table
- `id` (Primary Key)
- `name`
- `email` (Unique)
- `address`
- `owner_id` (Foreign Key to users)
- `created_at`, `updated_at`

### Ratings Table
- `id` (Primary Key)
- `user_id` (Foreign Key to users)
- `store_id` (Foreign Key to stores)
- `rating` (1-5)
- `comment`
- `created_at`, `updated_at`

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd store-rating-system
```

### 2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration
Create `.env` file in the server directory:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_ratings_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Server
PORT=5000
NODE_ENV=development
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb store_ratings_db

# Run database initialization
cd server
node scripts/init-db.js
```

### 5. Start the application
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory, in new terminal)
npm start
```

## 🔑 Default Login Credentials

### System Administrator
- Email: `admin@system.com`
- Password: `Admin@123`

### Sample Normal User
- Email: `user@example.com`
- Password: `User@123`

### Sample Store Owner
- Email: `store@example.com`
- Password: `Store@123`

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/update-password` - Update password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Stores
- `GET /api/stores` - Get all stores (with search/filter)
- `GET /api/stores/:id` - Get store details
- `POST /api/stores` - Add new store (Admin only)

### Ratings
- `POST /api/ratings` - Submit rating
- `PUT /api/ratings/:id` - Update rating
- `GET /api/ratings/store/:storeId` - Get store ratings

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Add new user
- `GET /api/admin/stores` - Get all stores

## 🧪 Testing

The application includes sample data for testing:
- 1 System Administrator
- 2 Normal Users
- 2 Store Owners
- 2 Stores
- 3 Sample Ratings

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers

## 📁 Project Structure

```
store-rating-system/
├── server/
│   ├── config/
│   │   └── database.js
│   ├── database/
│   │   └── schema.sql
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── ratings.js
│   │   ├── stores.js
│   │   └── users.js
│   ├── scripts/
│   │   └── init-db.js
│   └── index.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_production_jwt_secret
```

### Build and Deploy
```bash
# Build client
cd client
npm run build

# Start production server
cd ../server
npm start
```

## 📝 Form Validations

- **Name**: 20-60 characters
- **Address**: Maximum 400 characters
- **Password**: 8-16 characters, 1 uppercase, 1 special character
- **Email**: Standard email validation
- **Rating**: 1-5 stars

## 🔍 Search & Filtering

- Store search by name and address
- User filtering by name, email, address, and role
- Sortable tables for all listings
- Pagination support

## 📊 Dashboard Features

- Total user count
- Total store count
- Total ratings count
- Store performance metrics
- User activity tracking

---

**Note**: This is an internship coding challenge project. Change default passwords and JWT secrets in production environments.
