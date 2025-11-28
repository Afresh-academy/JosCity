# Starting Development Servers

## Quick Start

You need to run **both** the frontend and backend servers for the app to work.

### Option 1: Run in Separate Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd JosCity-Backend
npm install  # Only needed first time
npm run dev
```

**Terminal 2 - Frontend:**
```bash
# In the root directory
npm run dev
```

### Option 2: Use a Package Manager (Concurrently)

If you want to run both in one terminal, install `concurrently`:

```bash
npm install --save-dev concurrently
```

Then add this script to your root `package.json`:
```json
"dev:all": "concurrently \"npm run dev\" \"cd JosCity-Backend && npm run dev\""
```

Then run:
```bash
npm run dev:all
```

## Backend Setup (First Time Only)

1. **Navigate to backend directory:**
   ```bash
   cd JosCity-Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   # Copy the example file
   cp ENV_EXAMPLE.md .env
   # Or create manually
   ```

4. **Configure `.env` file:**
   ```env
   PORT=3000
   JWT_SECRET=your-secret-key-here
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=joscity
   DB_PORT=5432
   ```

5. **Start the backend:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 Server running on 0.0.0.0:3000
   ✅ Connected to PostgreSQL Database
   ```

## Frontend Setup (First Time Only)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

## Troubleshooting

### Backend won't start

- **Check if port 3000 is already in use:**
  ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
   ```

- **Check if `.env` file exists:**
  ```bash
   cd JosCity-Backend
   ls -la .env  # Should exist
   ```

- **Check if JWT_SECRET is set:**
  Backend requires `JWT_SECRET` in `.env` file

- **Check database connection:**
  Make sure PostgreSQL is running and credentials are correct

### Frontend can't connect to backend

- **Make sure backend is running on port 3000**
- **Check backend logs for errors**
- **Verify proxy settings in `vite.config.ts`**

### Port already in use

If port 3000 is in use, either:
1. Stop the process using port 3000
2. Change the backend port in `JosCity-Backend/.env`:
   ```env
   PORT=3001
   ```
   Then update `vite.config.ts` proxy target to `http://localhost:3001`

