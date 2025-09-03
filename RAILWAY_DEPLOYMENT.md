# 🚀 Railway ML Deployment Guide

## Prerequisites
- [Railway Account](https://railway.app/)
- [GitHub Repository](https://github.com/) (or GitLab/Bitbucket)
- Your Store Rating System code

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Ensure these files are in your repo:**
   - ✅ `railway.json`
   - ✅ `package.json` (with production scripts)
   - ✅ `server/package.json`
   - ✅ `server/index.js` (updated for production)

## Step 2: Create Railway Project

1. **Go to [Railway.app](https://railway.app/)**
2. **Click "New Project"**
3. **Choose "Deploy from GitHub repo"**
4. **Select your repository**
5. **Click "Deploy Now"**

## Step 3: Set Environment Variables

In your Railway project dashboard:

1. **Go to "Variables" tab**
2. **Add these environment variables:**

   ```env
   # Database (Use Railway PostgreSQL)
   DB_HOST=your_railway_postgres_host
   DB_PORT=5432
   DB_NAME=your_railway_postgres_db
   DB_USER=your_railway_postgres_user
   DB_PASSWORD=your_railway_postgres_password
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h
   
   # Server
   PORT=5000
   NODE_ENV=production
   
   # Client URL (Your Railway app URL)
   CLIENT_URL=https://your-app-name.railway.app
   ```

## Step 4: Add PostgreSQL Database

1. **In Railway dashboard, click "New"**
2. **Choose "Database" → "PostgreSQL"**
3. **Copy the connection details to your environment variables**
4. **Wait for database to be ready**

## Step 5: Initialize Database

1. **Go to your Railway app's "Deployments" tab**
2. **Click on the latest deployment**
3. **Go to "Logs" tab**
4. **Run database initialization:**
   ```bash
   npm run db:init
   ```

## Step 6: Deploy

1. **Railway will automatically deploy when you push to GitHub**
2. **Monitor the deployment in the "Deployments" tab**
3. **Check logs for any errors**

## Step 7: Test Your App

1. **Your app will be available at:**
   ```
   https://your-app-name.railway.app
   ```

2. **Test the health endpoint:**
   ```
   https://your-app-name.railway.app/api/health
   ```

3. **Test login with demo accounts:**
   - **Admin:** admin@system.com / Admin@123
   - **Store Owner:** store@example.com / Store@123
   - **User:** user@example.com / User@123

## Troubleshooting

### Common Issues:

1. **Build fails:**
   - Check if all dependencies are in `package.json`
   - Ensure Node.js version is compatible

2. **Database connection fails:**
   - Verify environment variables are correct
   - Check if PostgreSQL service is running

3. **CORS errors:**
   - Ensure `CLIENT_URL` is set correctly
   - Check if `NODE_ENV=production`

4. **App not loading:**
   - Check if React build was successful
   - Verify static file serving is working

### Useful Commands:

```bash
# View logs
railway logs

# Check status
railway status

# Restart service
railway service restart

# View environment variables
railway variables
```

## Cost Optimization

- **Free Tier:** 500 hours/month
- **Pay-as-you-go:** $0.000463 per second
- **Database:** $5/month for PostgreSQL

## Support

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Issues](https://github.com/railwayapp/railway/issues)

---

**🎯 Your Store Rating System will be live on Railway!**
