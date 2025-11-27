# Frontend Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
# For local development:
VITE_API_URL=http://localhost:3000/api

# For production (Render):
# VITE_API_URL=https://joscity-backend.onrender.com/api
```

## For Render Deployment

Set this in Render's environment variables:
- `VITE_API_URL=https://joscity-backend.onrender.com/api`

Replace `joscity-backend` with your actual backend service name.

