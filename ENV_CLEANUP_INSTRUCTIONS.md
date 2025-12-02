# Environment Variable Cleanup Instructions

## Remove Resend Variables

Please manually remove these lines from your `.env` files:

### In `JosCity-Backend/.env`:
```env
# REMOVE THESE LINES:
RESEND_API_KEY=re_...
RESEND_FROM="JosCity <...>"
```

### In root `.env` (if exists):
```env
# REMOVE THESE LINES:
RESEND_API_KEY=re_...
RESEND_FROM="JosCity <...>"
```

## Add SMTP Configuration

Replace the removed Resend variables with SMTP configuration:

```env
# SMTP Configuration (REQUIRED)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="JosCity <noreply@joscity.com>"
```

## After Making Changes

1. **Restart your backend server** for changes to take effect
2. **Run `npm install`** in both directories to remove the `resend` package:
   ```bash
   cd JosCity-Backend
   npm install
   
   cd ..
   npm install
   ```

## Verification

After cleanup, verify:
- ✅ No `RESEND_API_KEY` or `RESEND_FROM` in `.env` files
- ✅ SMTP variables are configured
- ✅ `resend` package removed from `package.json` files
- ✅ Server starts without Resend-related errors

