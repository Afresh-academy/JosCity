# JosCity Email Configuration Guide

## SMTP Email Service Setup

The application uses **SMTP (via Nodemailer)** for sending emails. This guide will help you configure your SMTP settings.

## Environment Variables Setup

Update your `.env` file (in `JosCity-Backend/`) with:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="JosCity <noreply@joscity.com>"
```

## Email Address Options

You can use any of these email addresses with `joscity.com`:

- **`noreply@joscity.com`** (Recommended - for automated emails)
- **`support@joscity.com`** (For support emails)
- **`hello@joscity.com`** (For general contact)
- **`contact@joscity.com`** (For contact forms)

## SMTP Provider Setup

### Gmail Setup

1. **Enable 2-Step Verification** on your Google account
2. **Generate an App Password**:

   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this 16-character password as `SMTP_PASS`

3. **Configuration**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_16_char_app_password
   SMTP_FROM="JosCity <noreply@joscity.com>"
   ```

### Outlook/Hotmail Setup

1. **Enable App Password**:

   - Go to [Microsoft Account Security](https://account.microsoft.com/security)
   - Advanced security options → App passwords
   - Generate a new app password

2. **Configuration**:
   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=your_email@outlook.com
   SMTP_PASS=your_app_password
   SMTP_FROM="JosCity <noreply@joscity.com>"
   ```

### Custom SMTP Server

For other SMTP providers (SendGrid, Mailgun, etc.):

```env
SMTP_HOST=your_smtp_server.com
SMTP_PORT=465  # or 587 for TLS
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM="JosCity <noreply@joscity.com>"
```

## Port Configuration

- **Port 465**: SSL/TLS (secure) - Recommended
- **Port 587**: STARTTLS (secure)
- **Port 25**: Unencrypted (not recommended)

## Current Behavior

**If SMTP is configured correctly:**

```
✅ SMTP email service is configured (Host: smtp.gmail.com:465, User: your_email@...)
   From address: "JosCity" <noreply@joscity.com>
✅ Email sent successfully to: user@example.com (Message ID: ...)
```

**If SMTP is not configured:**

```
⚠️  SMTP_USER or SMTP_PASS not configured. Email sending will fail.
   Please add SMTP_USER and SMTP_PASS to your .env file
```

## Testing

After updating your `.env` file:

1. Restart your backend server
2. Try registering a new user
3. Check server logs for email sending confirmation
4. Check your email inbox (and spam folder)

## Troubleshooting

### Authentication Failed (EAUTH)

- Verify your `SMTP_USER` and `SMTP_PASS` are correct
- For Gmail, ensure you're using an App Password, not your regular password
- Check that 2-Step Verification is enabled (for Gmail)

### Connection Failed (ECONNECTION)

- Verify `SMTP_HOST` and `SMTP_PORT` are correct
- Check your firewall/network settings
- Try a different port (465 vs 587)

### Invalid Sender (553)

- Verify `SMTP_FROM` email matches your `SMTP_USER` domain
- Some providers require the sender to match the authenticated user

## Important Notes

- The `SMTP_FROM` field is optional - if not set, it will use `SMTP_USER`
- Always use App Passwords for Gmail/Outlook (not your regular password)
- Keep your SMTP credentials secure and never commit them to version control
- The `.env` file should be in `.gitignore`

## Security Best Practices

1. **Use App Passwords**: Never use your main account password
2. **Environment Variables**: Store credentials in `.env`, never in code
3. **Restrict Access**: Limit who can access your `.env` file
4. **Regular Rotation**: Change passwords periodically
5. **Monitor Logs**: Check email sending logs for suspicious activity
