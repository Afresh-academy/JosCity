# Troubleshooting Guide

## Common Issues and Solutions

### Error: "Server returned unexpected format. Expected JSON but got: text/html; charset=utf-8"

**Problem:** The frontend is receiving HTML instead of JSON from the backend API. This usually means the `VITE_API_URL` environment variable is not configured correctly in your production deployment.

**Solution for Vercel (Frontend):**

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com) and log in
   - Select your project

2. **Navigate to Environment Variables:**
   - Go to **Settings** → **Environment Variables**
   - Look for `VITE_API_URL` variable

3. **If `VITE_API_URL` is missing or incorrect:**
   - Click **Add New** or **Edit** if it exists
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-service-name.onrender.com/api`
     - Replace `your-backend-service-name` with your actual backend service name
     - Example: `https://joscity-backend.onrender.com/api`
   - **Environment**: Select **Production**, **Preview**, and **Development** (or just **Production** if you only want it for production)
   - Click **Save**

4. **Redeploy your frontend:**
   - After adding/updating the environment variable, go to **Deployments** tab
   - Click the **⋯** (three dots) menu on the latest deployment
   - Select **Redeploy**
   - Or push a new commit to trigger automatic redeployment
   - Wait for the deployment to complete (usually 1-3 minutes)

5. **Verify the fix:**
   - Once deployed, refresh your website
   - The error should be resolved
   - Check browser console to confirm API calls are going to the correct URL

**Important Notes:**
- Environment variables must be set in Vercel's dashboard, not in a `.env` file (`.env` files are not used in production on Vercel)
- The `VITE_API_URL` must include the full URL with `https://` and end with `/api`
- Make sure your backend service is running and accessible at that URL
- After changing environment variables, you must redeploy for changes to take effect
- Vite environment variables must start with `VITE_` to be exposed to the client-side code

### How to Find Your Backend URL

1. Go to Render Dashboard
2. Click on your backend service
3. Look at the top of the page - you'll see the service URL
4. It will be in the format: `https://your-service-name.onrender.com`
5. Add `/api` to the end for the `VITE_API_URL` value

### Verify Backend is Running

1. Open your backend URL in a browser: `https://your-backend.onrender.com`
2. You should see: `{"message":"JosCity Backend API","version":"1.0.0","status":"running",...}`
3. Test the health endpoint: `https://your-backend.onrender.com/api/ping`
4. You should see: `{"message":"pong","status":"healthy",...}`

If the backend is not responding:
- Check backend service logs in Render
- Verify the backend service is not paused (free tier services pause after inactivity)
- Check that all required environment variables are set in the backend service

### CORS Errors

If you see CORS errors in the browser console:

1. Go to your backend service on Render
2. Check the `FRONTEND_URL` environment variable
3. It should be set to your frontend URL: 
   - If frontend is on Vercel: `https://your-project.vercel.app` or your custom domain
   - If frontend is on Render: `https://your-frontend.onrender.com`
4. Update `JosCity-Backend/server.ts` if needed to include your frontend URL in the CORS allowed origins

### Complete Setup Checklist (Vercel Frontend + Render Backend)

**Frontend (Vercel):**
- ✅ `VITE_API_URL` is set to your Render backend URL: `https://your-backend.onrender.com/api`
- ✅ Environment variable is set for **Production** environment
- ✅ Frontend has been redeployed after setting the variable

**Backend (Render):**
- ✅ `FRONTEND_URL` is set to your Vercel frontend URL: `https://your-project.vercel.app` (or your custom domain)
- ✅ Backend service is running and not paused
- ✅ CORS settings in `server.ts` include your Vercel frontend URL

**To find your Vercel frontend URL:**
1. Go to Vercel Dashboard
2. Select your project
3. The URL will be shown at the top: `https://your-project.vercel.app`
4. Or check the **Domains** section for custom domains

**To find your Render backend URL:**
1. Go to Render Dashboard
2. Click on your backend service
3. The URL will be shown at the top: `https://your-service.onrender.com`

### Still Having Issues?

1. **Check browser console** for detailed error messages (F12 → Console tab)
2. **Check Vercel deployment logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - Check the build logs for any errors
3. **Check Render backend logs:**
   - Go to Render Dashboard → Your Backend Service → Logs
   - Look for any errors or connection issues
4. **Verify environment variables:**
   - Vercel: Settings → Environment Variables (check `VITE_API_URL`)
   - Render: Environment tab (check `FRONTEND_URL`)
5. **Test backend directly:**
   - Open `https://your-backend.onrender.com/api/ping` in your browser
   - Should return: `{"message":"pong","status":"healthy",...}`
   - If you get HTML or an error, the backend isn't running correctly
6. **Test API endpoint:**
   - Try: `https://your-backend.onrender.com/api/landing-page/hero/settings`
   - Should return JSON, not HTML

---

## Email Not Working

### Problem: Emails are not being sent (registration, password reset, etc.)

**Common Causes:**
1. SMTP environment variables not set in Render
2. Incorrect SMTP credentials
3. Wrong SMTP port/security settings
4. Gmail requires App Password (not regular password)
5. Email service provider blocking connections

### Solution: Configure SMTP in Render

1. **Go to Render Dashboard:**
   - Navigate to your backend service
   - Click on **Environment** tab

2. **Add/Update SMTP Environment Variables:**
   
   **For Gmail:**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM="JosCity <your-email@gmail.com>"
   ```
   
   **For Other Providers (SendGrid, Mailgun, etc.):**
   ```
   SMTP_HOST=smtp.sendgrid.net  (or your provider's SMTP host)
   SMTP_PORT=587
   SMTP_USER=apikey  (or your SMTP username)
   SMTP_PASS=your-api-key  (or your SMTP password)
   SMTP_FROM="JosCity <noreply@yourdomain.com>"
   ```

3. **Important Notes for Gmail:**
   - You **cannot** use your regular Gmail password
   - You **must** create an App Password:
     1. Go to your Google Account settings
     2. Security → 2-Step Verification (must be enabled)
     3. App Passwords → Generate new app password
     4. Use the generated 16-character password as `SMTP_PASS`
   - Port 587 with STARTTLS is recommended (secure: false)
   - Port 465 with SSL is also supported (secure: true)

4. **Redeploy Backend:**
   - After adding environment variables, Render will automatically redeploy
   - Or manually trigger a redeploy from the Render dashboard

5. **Check Backend Logs:**
   - Go to Render Dashboard → Your Backend Service → Logs
   - Look for email-related messages:
     - ✅ `Email server is ready to send messages` = Configuration is correct
     - ❌ `Email configuration error` = Check your SMTP settings
     - ❌ `Authentication failed` = Wrong username/password
     - ❌ `Connection failed` = Wrong host/port or network issue

### Verify Email Configuration

1. **Check startup logs:**
   - When backend starts, you should see:
     - `✅ Email server is ready to send messages`
     - Or error messages indicating what's wrong

2. **Test email sending:**
   - Try registering a new user
   - Check backend logs for email sending attempts
   - Look for: `📧 Attempting to send email to: ...`
   - Success: `✅ Email sent successfully to: ...`
   - Failure: `❌ Email sending failed: ...`

### Common Email Errors and Fixes

**Error: "EAUTH" (Authentication failed)**
- ✅ Check `SMTP_USER` is correct
- ✅ For Gmail, use App Password (not regular password)
- ✅ Make sure 2-Step Verification is enabled on Gmail account

**Error: "ECONNECTION" or "ETIMEDOUT" (Connection failed)**
- ✅ Check `SMTP_HOST` is correct (e.g., `smtp.gmail.com`)
- ✅ Check `SMTP_PORT` is correct (587 for Gmail with STARTTLS, 465 for SSL)
- ✅ Verify network allows outbound SMTP connections
- ✅ Some providers require whitelisting Render's IP addresses

**Error: "EENVELOPE" (Invalid email address)**
- ✅ Check the recipient email address is valid
- ✅ Verify email format is correct

### Alternative Email Services

If Gmail doesn't work, consider these alternatives:

**SendGrid (Recommended for production):**
- Free tier: 100 emails/day
- More reliable than Gmail
- Better for production use
- Setup: https://sendgrid.com

**Mailgun:**
- Free tier: 5,000 emails/month
- Good for development and production
- Setup: https://mailgun.com

**Mailtrap (For testing):**
- Catches all emails (doesn't send real emails)
- Perfect for development/testing
- Setup: https://mailtrap.io

### Email Configuration Checklist

**Backend (Render):**
- ✅ `SMTP_HOST` is set (e.g., `smtp.gmail.com`)
- ✅ `SMTP_PORT` is set (587 for STARTTLS, 465 for SSL)
- ✅ `SMTP_USER` is set (your email or API key)
- ✅ `SMTP_PASS` is set (App Password for Gmail, API key for others)
- ✅ `SMTP_FROM` is set (sender email address)
- ✅ Backend has been redeployed after setting variables
- ✅ Backend logs show "Email server is ready to send messages"

### Still Having Email Issues?

1. **Check Render backend logs** for detailed error messages
2. **Verify all SMTP environment variables** are set correctly
3. **Test SMTP connection** using a simple email service test
4. **Try a different email provider** (SendGrid, Mailgun) if Gmail doesn't work
5. **Check email spam folder** - emails might be going there
6. **Verify recipient email address** is correct and valid

