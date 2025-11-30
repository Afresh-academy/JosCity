# Backend Update Instructions

## Changes Required

### 1. Remove 0.0.0.0 from server.ts

**Location**: `JosCity-Backend-backup/server.ts` (around lines 80-85)

**Current code** (with 0.0.0.0):
```typescript
if (process.env.VERCEL !== "1") {
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = "0.0.0.0";
  const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
```

**Change to** (without explicit host - Node.js will default to all interfaces):
```typescript
if (process.env.VERCEL !== "1") {
  const PORT = Number(process.env.PORT) || 3000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
```

**Alternative** (if you want to keep the URL in the log):
```typescript
if (process.env.VERCEL !== "1") {
  const PORT = Number(process.env.PORT) || 3000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
```

### 2. Base URL Already Updated ✅

The `render.yaml` file has been updated to use:
- **New Base URL**: `https://new-joscity.onrender.com/api`

This is configured in the frontend service environment variables.

## Summary

1. ✅ `render.yaml` - Updated to use `https://new-joscity.onrender.com/api`
2. ⚠️ `server.ts` - Needs manual update to remove explicit `HOST = "0.0.0.0"` binding

## Notes

- Removing the explicit `0.0.0.0` host parameter from `app.listen()` is fine because Node.js defaults to listening on all interfaces when no host is specified
- The server will still bind to all network interfaces (0.0.0.0) by default
- This change makes the code cleaner while maintaining the same functionality

