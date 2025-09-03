# Store Rating System

A full-stack web application for rating and reviewing stores, built with modern web technologies.

## 🌐 **Live URLs**

- **Frontend**: [https://roxlier.web.app/](https://roxlier.web.app/)
- **Backend**: [https://roxlier-backend.up.railway.app/](https://roxlier-backend.up.railway.app/)
- **Database**: PostgreSQL on Render

## 🏗️ **Project Structure**

```
store-ratings-system/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── index.js       # App entry point
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                 # Node.js Backend
│   ├── routes/            # API route handlers
│   ├── middleware/        # Express middleware
│   ├── database/          # Database schema & scripts
│   ├── config/            # Configuration files
│   └── index.js           # Server entry point
└── README.md              # This file
```

## 🛠️ **Tech Stack**

### **Frontend**
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Hot Toast** - Notifications

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

### **Deployment**
- **Firebase Hosting** - Frontend hosting
- **Railway** - Backend hosting
- **Render** - PostgreSQL database

## 🚀 **Local Development Setup**

### **Prerequisites**
- Node.js (v18+)
- PostgreSQL
- npm or yarn

### **Backend Setup**
```bash
cd server
npm install
cp env.example .env
# Update .env with your database credentials
npm run dev
```

### **Frontend Setup**
```bash
cd client
npm install
npm start
```

### **Build Commands**
```bash
# Frontend build
cd client
npm run build

# Backend (no build needed for Node.js)
cd server
npm start
```

## 📊 **Database Schema**

- **Users**: Authentication, roles, profiles
- **Stores**: Store information, ratings, owner details
- **Ratings**: User ratings, comments, timestamps
- **Admin**: User management, store oversight

## 🎨 **UI Inspiration**

UI design inspired by [EcoBazaarX project](https://akashkeote.github.io/EcoBazaarX/) from Infosys internship, featuring:
- Clean, modern interface
- Responsive design
- Intuitive navigation
- Professional color scheme

## 🔧 **Development Notes**

- **Error Resolution**: Most development issues resolved with ChatGPT 5.0 assistance
- **CORS**: Configured for multiple frontend domains
- **Authentication**: JWT-based with role-based access control
- **Responsive**: Mobile-first design approach

## 📝 **Environment Variables**

```env
# Database
DB_HOST=your_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
```

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 **License**

Demo

---

**Built with ❤️ by Akash Keote**
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

