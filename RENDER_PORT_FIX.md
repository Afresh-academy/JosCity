# Render.com Port Binding Fix

## Problem
Render.com requires your server to:
1. Bind to `0.0.0.0` (not `localhost` or `127.0.0.1`)
2. Use the `PORT` environment variable (provided by Render)

## Solution

In your `JosCity-Backend/server.ts` (or `server.js`), ensure your server listens like this:

### ❌ Wrong (won't work on Render):
```typescript
const PORT = process.env.PORT || 3000;
app.listen(PORT, 'localhost', () => {
  console.log(`Server running on port ${PORT}`);
});
```

or

```typescript
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### ✅ Correct (works on Render):
```typescript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

or even simpler:

```typescript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Note: When you don't specify a hostname, Node.js defaults to listening on all interfaces (`0.0.0.0`), which is what Render needs.

## Quick Fix

Update your server file (`JosCity-Backend/server.ts` or `server.js`) to:

```typescript
import express from 'express';
// ... other imports

const app = express();
// ... middleware and routes

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
```

## Important Notes

1. **Render automatically provides PORT**: Render sets the `PORT` environment variable automatically. You don't need to set it in `render.yaml`, but having a fallback value is fine.

2. **The PORT in render.yaml**: I've removed the hardcoded `PORT: 10000` from your `render.yaml` because Render will provide its own PORT value. However, if you want a fallback for local development, you can keep it, but the server code should always use `process.env.PORT || <fallback>`.

3. **Binding to 0.0.0.0**: This is the critical part. Your server MUST bind to `0.0.0.0` (all network interfaces), not `localhost` or `127.0.0.1`.

## Verify

After deploying, Render should detect the open port and your service will be accessible. You should see in the logs:
```
Server is running on http://0.0.0.0:<PORT>
```

## Common Issues

- If you still see "No open ports detected", check:
  1. Your server file is actually starting (check build logs)
  2. The server is binding to `0.0.0.0` (not `localhost`)
  3. The server is using `process.env.PORT` (not a hardcoded port)
  4. There are no errors preventing the server from starting

