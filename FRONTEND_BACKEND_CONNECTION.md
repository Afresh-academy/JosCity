# Frontend to Render Backend Connection Guide

## ✅ Configuration Complete

The frontend is now configured to connect to your Render backend.

### Current Configuration

1. **`.env` file** (local development):
   ```
   VITE_API_URL=https://new-joscity.onrender.com/api
   ```

2. **`render.yaml`** (production deployment):
   ```yaml
   envVars:
     - key: VITE_API_URL
       value: https://new-joscity.onrender.com/api
   ```

3. **`src/api/config.js`**:
   ```javascript
   export const BASE_URL = import.meta.env.VITE_API_URL || '/api';
   ```

## How It Works

- **Local Development**: Uses `VITE_API_URL` from `.env` file → `https://new-joscity.onrender.com/api`
- **Production (Render)**: Uses `VITE_API_URL` from Render environment variables → `https://new-joscity.onrender.com/api`
- **Fallback**: If `VITE_API_URL` is not set, defaults to `/api` (uses local proxy)

## Testing the Connection

### 1. Start the frontend development server:
```bash
npm run dev
```

### 2. Test API endpoints:
The frontend will make requests to:
- `https://new-joscity.onrender.com/api/auth/personal/register`
- `https://new-joscity.onrender.com/api/auth/business/register`
- `https://new-joscity.onrender.com/api/admin/auth/login`
- etc.

### 3. Verify in Browser Console:
Open browser DevTools (F12) and check the Network tab. All API requests should go to `https://new-joscity.onrender.com/api/*`

## Switching Between Local and Remote Backend

### To use Render backend (current):
```env
VITE_API_URL=https://new-joscity.onrender.com/api
```

### To use local backend:
```env
# Comment out or remove VITE_API_URL to use proxy
# VITE_API_URL=https://new-joscity.onrender.com/api
```
Or set it to local:
```env
VITE_API_URL=http://localhost:3000/api
```

**Important**: After changing `.env`, restart your dev server!

## Troubleshooting

### Issue: CORS errors
**Solution**: Make sure your Render backend has CORS configured to allow requests from your frontend origin.

### Issue: 404 errors
**Solution**: Verify the backend is deployed and accessible at `https://new-joscity.onrender.com/api/ping`

### Issue: Connection refused
**Solution**: 
1. Check if the Render backend service is running
2. Verify the URL is correct (should end with `/api`)
3. Check Render logs for backend errors

## Next Steps

1. ✅ Frontend configured to use Render backend
2. ⚠️ Make sure Render backend is deployed and running
3. ⚠️ Verify CORS is configured on backend to allow frontend requests
4. ✅ Test the connection by starting the dev server

