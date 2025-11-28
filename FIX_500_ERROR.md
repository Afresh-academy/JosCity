# Fix: 500 Error on Admin Login

## Problem
Getting "Server returned empty response (Status: 500)" when trying to login to admin panel.

## Common Causes & Solutions

### 1. Database Not Connected

**Check backend logs** - Look for database connection messages:
- ✅ `✅ Connected to PostgreSQL Database` = Database is connected
- ❌ `❌ Database Connection Failed` = Database connection issue

**Solution:**
1. Make sure PostgreSQL is running
2. Check your `.env` file in `JosCity-Backend/`:
   ```env
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=joscity
   DB_PORT=5432
   ```
3. Or use `DATABASE_URL`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/joscity
   ```

### 2. Users Table Doesn't Exist

**Check backend logs** - Look for:
- `⚠️  WARNING: Users table not found in joscity schema!`

**Solution:**
Run the database schema script:
```bash
cd JosCity-Backend
psql -U your_user -d joscity -f database/joscity/users_schema.sql
```

Or if using DATABASE_URL:
```bash
psql $DATABASE_URL -f database/joscity/users_schema.sql
```

### 3. Database Credentials Wrong

**Check backend logs** for:
- `❌ Database Connection Failed: password authentication failed`
- `❌ Database Connection Failed: database "joscity" does not exist`

**Solution:**
- Verify database username and password
- Make sure the database exists
- Check that PostgreSQL is running

### 4. No Admin User Exists

Even if database is connected, you need an admin user to login.

**Solution:**
Create an admin user in the database:
```sql
-- Connect to your database
psql -U your_user -d joscity

-- Insert admin user (replace with your details)
INSERT INTO joscity.users (
  user_name, user_firstname, user_lastname, user_email, 
  user_password, user_group, account_status, account_type
) VALUES (
  'admin',
  'Admin',
  'User',
  'admin@example.com',
  '$2a$10$YourHashedPasswordHere',  -- Use bcrypt hash
  1,  -- user_group = 1 means admin
  'approved',
  'personal'
);
```

**Or use the registration flow:**
1. Register a regular user through the frontend
2. Manually update the user in database:
   ```sql
   UPDATE joscity.users 
   SET user_group = 1, account_status = 'approved' 
   WHERE user_email = 'your-email@example.com';
   ```

### 5. JWT_SECRET Not Set

**Check backend logs** - Server should show:
- `🔐 JWT Authentication: Configured`

**Solution:**
Add to `JosCity-Backend/.env`:
```env
JWT_SECRET=your-random-secret-key-here
```

## Quick Diagnostic Steps

1. **Check backend is running:**
   ```bash
   # Should see: 🚀 Server running on 0.0.0.0:3000
   ```

2. **Check database connection:**
   ```bash
   # In backend logs, look for database connection message
   ```

3. **Test database directly:**
   ```bash
   psql -U your_user -d joscity -c "SELECT COUNT(*) FROM joscity.users;"
   ```

4. **Check backend logs for specific error:**
   - Look for the actual error message in the console
   - The improved error handling will now show specific database errors

## Still Not Working?

1. **Check backend terminal** for the actual error message
2. **Verify all environment variables** are set correctly
3. **Test database connection** directly with psql
4. **Check if users table exists:**
   ```sql
   SELECT EXISTS (
     SELECT FROM information_schema.tables 
     WHERE table_schema = 'joscity' 
     AND table_name = 'users'
   );
   ```

## For Local Development (No Database)

If you just want to test the frontend without setting up a database:

1. The backend will start but database queries will fail
2. You'll get 500 errors on any endpoint that uses the database
3. For full functionality, you need PostgreSQL running

**Quick PostgreSQL setup:**
- **Windows:** Download from https://www.postgresql.org/download/windows/
- **Mac:** `brew install postgresql@14`
- **Linux:** `sudo apt-get install postgresql`

