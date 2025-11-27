# Render Deployment Guide

This guide will help you deploy JosCity to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. GitHub repository with your code
3. PostgreSQL database (can be created via Render)

## Deployment Steps

### Step 1: Create PostgreSQL Database

1. Go to Render Dashboard → New → PostgreSQL
2. Name it: `joscity-db`
3. Select **Starter** plan (free tier available)
4. Select region: **Oregon** (or your preferred region)
5. Click **Create Database**
6. Note the connection details (you'll need them later)

### Step 2: Deploy Backend Service

1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `joscity-backend`
   - **Environment**: `Node`
   - **Region**: `Oregon` (same as database)
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: `JosCity-Backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Starter` (free tier available)

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=<generate-a-strong-random-secret>
   DB_HOST=<from-database-connection-string>
   DB_USER=<from-database-connection-string>
   DB_PASSWORD=<from-database-connection-string>
   DB_NAME=joscity
   DB_PORT=5432
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=<your-email@gmail.com>
   SMTP_PASS=<your-app-password>
   SMTP_FROM=noreply@joscity.com
   ```

5. Click **Create Web Service**

### Step 3: Initialize Database

After the backend is deployed, you need to run the database migrations:

1. Go to your database in Render Dashboard
2. Click on **Connect** or use the **psql** connection string
3. Run the following SQL files in order:
   ```bash
   # Connect to database
   psql <connection-string>
   
   # Run schema files
   \i database/joscity/users_schema.sql
   \i database/joscity/setup_landing_page.sql
   ```

   Or use Render's Shell:
   - Go to your backend service → Shell
   - Run: `psql $DATABASE_URL -f database/joscity/users_schema.sql`
   - Run: `psql $DATABASE_URL -f database/joscity/setup_landing_page.sql`

### Step 4: Deploy Frontend Service

1. Go to Render Dashboard → New → Static Site
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `joscity-frontend`
   - **Environment**: `Static Site`
   - **Region**: `Oregon`
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: `Starter` (free tier available)

4. Add Environment Variables:
   ```
   VITE_API_URL=https://joscity-backend.onrender.com/api
   NODE_ENV=production
   ```

5. Click **Create Static Site**

### Step 5: Update CORS Settings

The backend needs to allow requests from your frontend domain. Update `JosCity-Backend/server.ts`:

```typescript
app.use(cors({
  origin: [
    'https://joscity-frontend.onrender.com',
    'http://localhost:5173' // for local development
  ],
  credentials: true
}));
```

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `DB_HOST` | Database host | `dpg-xxxxx-a.oregon-postgres.render.com` |
| `DB_USER` | Database user | `joscity_user` |
| `DB_PASSWORD` | Database password | `xxxxx` |
| `DB_NAME` | Database name | `joscity` |
| `DB_PORT` | Database port | `5432` |
| `SMTP_HOST` | SMTP server | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password | `your-app-password` |
| `SMTP_FROM` | From email address | `noreply@joscity.com` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://joscity-backend.onrender.com/api` |

## Using render.yaml (Alternative Method)

If you prefer using `render.yaml`:

1. Push `render.yaml` to your repository
2. Go to Render Dashboard → New → Blueprint
3. Connect your repository
4. Render will automatically detect and create all services

## Database Connection

Render provides a `DATABASE_URL` environment variable automatically. You can use it directly or parse it into individual variables.

To use `DATABASE_URL` in your code, update `database.ts`:

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

## Troubleshooting

### Backend won't start
- Check build logs for TypeScript errors
- Verify all environment variables are set
- Check that `dist/server.js` exists after build

### Database connection fails
- Verify database credentials in environment variables
- Check that database is in the same region as backend
- Ensure database is not paused (free tier pauses after inactivity)

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend service is running and healthy

### 404 errors on frontend routes
- Ensure `_redirects` file exists in `public/` folder
- For Render Static Sites, routes are handled automatically

## Free Tier Limitations

- Services may spin down after 15 minutes of inactivity
- First request after spin-down may be slow (cold start)
- Database has connection limits
- Consider upgrading to paid plans for production

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Backend health check passes (`/api/ping`)
- [ ] Frontend loads correctly
- [ ] API calls from frontend work
- [ ] Authentication flow works
- [ ] Email service configured (if using)
- [ ] CORS configured correctly
- [ ] Environment variables all set
- [ ] Custom domain configured (optional)

## Support

For Render-specific issues, check:
- Render Documentation: https://render.com/docs
- Render Status: https://status.render.com
- Render Community: https://community.render.com

