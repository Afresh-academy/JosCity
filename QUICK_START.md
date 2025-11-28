# Quick Start Guide

## 🚀 Start Development Servers

### The Problem
Your frontend is trying to connect to the backend at `http://localhost:3000`, but the backend server is not running.

### The Solution

**You need to start the backend server in a separate terminal:**

1. **Open a new terminal/command prompt**

2. **Navigate to the backend directory:**
   ```bash
   cd JosCity-Backend
   ```

3. **Make sure you have a `.env` file:**
   - If you don't have one, copy `ENV_EXAMPLE.md` to `.env`
   - At minimum, you need:
     ```env
     PORT=3000
     JWT_SECRET=your-secret-key-here-change-this
     ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

5. **You should see:**
   ```
   🚀 Server running on 0.0.0.0:3000
   ✅ Connected to PostgreSQL Database
   ```

6. **Keep this terminal open** - the backend needs to keep running

7. **Your frontend terminal** (the one running `npm run dev`) should now be able to connect!

## 📝 First Time Setup

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd JosCity-Backend
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   # Windows PowerShell
   Copy-Item ENV_EXAMPLE.md .env
   
   # Mac/Linux
   cp ENV_EXAMPLE.md .env
   ```

3. **Edit `.env` file** and set at minimum:
   - `JWT_SECRET` - any random string (required)
   - Database credentials (if using local database)
   - SMTP settings (optional for development)

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

## 🔧 Troubleshooting

### "Port 3000 already in use"
- Another process is using port 3000
- Find and stop it, or change the port in `JosCity-Backend/.env`:
  ```env
  PORT=3001
  ```
- Then update `vite.config.ts` proxy target to `http://localhost:3001`

### "JWT_SECRET is not set"
- Add `JWT_SECRET=any-random-string` to `JosCity-Backend/.env`

### "Database connection failed"
- For local development, you can skip database setup initially
- The backend will still start, but database features won't work
- Set up PostgreSQL later when needed

### Backend starts but frontend still can't connect
- Make sure backend is running on the correct port (check the console output)
- Check that `vite.config.ts` proxy target matches your backend port
- Restart the frontend dev server

## 💡 Pro Tip

Use two terminal windows:
- **Terminal 1:** Backend (`cd JosCity-Backend && npm run dev`)
- **Terminal 2:** Frontend (`npm run dev`)

Or use a terminal splitter/manager to see both at once!

