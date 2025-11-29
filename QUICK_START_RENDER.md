# Quick Start: Deploy to Render

## 🚀 Fast Deployment (5 minutes)

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub**

2. **Go to Render Dashboard** → New → Blueprint
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`
   - Click **Apply**

3. **Set Environment Variables** in the backend service:
   - `JWT_SECRET` - Generate a random secret (use: `openssl rand -hex 32`)
   - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` - Your email credentials
   - `FRONTEND_URL` - Your frontend Render URL (auto-set after frontend deploys)

4. **Initialize Database**:
   - Go to backend service → Shell
   - Run: `psql $DATABASE_URL -f database/joscity/users_schema.sql`
   - Run: `psql $DATABASE_URL -f database/joscity/setup_landing_page.sql`

5. **Done!** Your app is live 🎉

### Option 2: Manual Setup

#### Step 1: Create Database
- Render Dashboard → New → PostgreSQL
- Name: `joscity-db`
- Plan: Starter
- Create

#### Step 2: Deploy Backend
- Render Dashboard → New → Web Service
- Connect GitHub repo
- Settings:
  - **Root Directory**: `JosCity-Backend`
  - **Build**: `npm install && npm run build`
  - **Start**: `npm start`
- Environment Variables:
  - `JWT_SECRET` (generate random)
  - `SMTP_*` (your email settings)
  - Database vars (auto-set if you link the database)

#### Step 3: Deploy Frontend
- Render Dashboard → New → Static Site
- Connect GitHub repo
- Settings:
  - **Build**: `npm install && npm run build`
  - **Publish**: `dist`
- Environment Variable:
  - `VITE_API_URL=https://your-backend.onrender.com/api`

#### Step 4: Initialize Database
- Backend service → Shell
- Run database setup scripts (see above)

## 📋 Environment Variables Checklist

### Backend (Required)
- ✅ `JWT_SECRET`
- ✅ `DATABASE_URL` (auto-set by Render when database is linked)
- ⚠️ `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (for email)
- ⚠️ `FRONTEND_URL` (for CORS)

### Frontend (Required)
- ✅ `VITE_API_URL`

## 🔗 URLs

After deployment, you'll get:
- Backend: `https://joscity-backend.onrender.com`
- Frontend: `https://joscity-frontend.onrender.com`

## 🐛 Common Issues

**Backend won't start?**
- Check build logs
- Verify `JWT_SECRET` is set
- Ensure database is linked

**Database connection fails?**
- Verify database is in same region
- Check `DATABASE_URL` is set
- Ensure database isn't paused

**Frontend can't reach backend?**
- Check `VITE_API_URL` matches backend URL
- Verify CORS settings in backend
- Check backend is running

## 📚 Full Documentation

See `RENDER_DEPLOYMENT.md` for detailed instructions.

