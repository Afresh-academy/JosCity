# 📧 Complete Guide: Finding Your SMTP Settings for Webmail

This guide explains how to find the correct SMTP settings for your email address `support@afresh.academy`.

---

## Part 1: Understanding Hosting Control Panels

### What is a Control Panel?

A **control panel** is like a dashboard where you manage your website and email settings. It's usually accessed through your web browser with a login.

### Common Control Panels:

1. **cPanel** - Most popular (looks like a dashboard with icons)
2. **Plesk** - Another popular one (similar interface)
3. **DirectAdmin** - Less common but similar
4. **Custom panels** - Some hosting companies have their own

### How to Access Your Control Panel:

- Usually found at: `https://yourdomain.com:2083` or `https://yourdomain.com:8443`
- Or check your hosting provider's welcome email
- Or log into your hosting account dashboard

---

## Part 2: Finding Email Settings in Your Control Panel

### Step-by-Step Instructions:

#### If you have cPanel:

1. **Log into cPanel**

   - Look for a section called "Email" or "Mail"

2. **Find Email Accounts**

   - Click on "Email Accounts" or "Email Accounts" icon
   - You should see a list of email addresses (including `support@afresh.academy`)

3. **Access Email Settings**

   - Click on "Connect Devices" or "Configure Mail Client" next to your email
   - OR click "Set Up Mail Client"
   - OR look for "Manual Settings" or "Server Settings"

4. **Look for "Outgoing Mail Server" or "SMTP Server"**
   - This will show you the SMTP host name

#### If you have Plesk:

1. **Log into Plesk**
2. **Click on "Mail"** in the left sidebar
3. **Click on your email address** (`support@afresh.academy`)
4. **Click "Mail Client Settings"** or "Email Client Configuration"
5. **Find "Outgoing Mail Server" settings**

#### If you're not sure which panel you have:

1. Contact your hosting provider's support
2. Ask them: "What is my SMTP server for support@afresh.academy?"
3. They'll provide: SMTP host, port, and authentication details

---

## Part 3: Understanding SMTP Host Names

### What is an SMTP Host?

The **SMTP host** (or SMTP server) is like the address of the post office that sends your emails. It tells your application where to connect to send emails.

### Common Patterns for SMTP Hosts:

For your domain `afresh.academy`, the SMTP server could be:

1. **`mail.afresh.academy`** ⭐ Most Common

   - This is the standard pattern: `mail.yourdomain.com`
   - Example: `mail.google.com` for Gmail

2. **`smtp.afresh.academy`**

   - Alternative pattern: `smtp.yourdomain.com`
   - Some providers use this instead

3. **`mail1.afresh.academy` or `mail2.afresh.academy`**

   - Some hosts use numbered mail servers
   - Your hosting might specify which one

4. **Your hosting provider's mail server**
   - Example: `mail.yourhostingcompany.com`
   - Your hosting company might use their own mail servers
   - Check your hosting provider's documentation

### How to Find the Correct SMTP Host:

**Method 1: Check Your Control Panel** (Best Method)

- Follow Part 2 instructions above
- Look for "Outgoing Mail Server" or "SMTP Server"

**Method 2: Check Your Hosting Provider's Documentation**

- Go to your hosting company's website
- Search for "SMTP settings" or "email server settings"
- Look for your specific hosting plan

**Method 3: Contact Support**

- Ask: "What is the SMTP server address for my email accounts?"

**Method 4: Test Common Patterns**

- Try `mail.afresh.academy` first
- If that doesn't work, try `smtp.afresh.academy`
- Enable `SMTP_DEBUG=true` in your `.env` file to see detailed logs

---

## Part 4: Understanding SMTP Ports

### What is a Port?

Think of a **port** like a specific door at an address. The SMTP host is the building, and the port is which door to use. Different ports use different security methods.

### Common SMTP Ports:

#### **Port 587** ⭐ Most Common (Recommended)

- **Security Method**: TLS/STARTTLS
- **How it works**: Starts as a regular connection, then upgrades to encrypted
- **Firewall**: Usually not blocked
- **When to use**: Default for most webmail providers

**Example in .env:**

```env
SMTP_PORT=587
```

#### **Port 465** (Alternative)

- **Security Method**: SSL (immediate encryption)
- **How it works**: Encrypted connection from the start
- **Firewall**: Sometimes blocked by strict firewalls
- **When to use**: If port 587 doesn't work

**Example in .env:**

```env
SMTP_PORT=465
```

#### **Port 25** ❌ Usually Blocked

- **Security Method**: None (unencrypted)
- **Why it's blocked**: Many ISPs and hosting companies block port 25 to prevent spam
- **When to use**: Almost never (only if specifically allowed by your hosting)

**Example in .env:**

```env
SMTP_PORT=25  # Don't use unless specifically told to
```

### How to Choose the Right Port:

1. **Start with Port 587** (recommended default)

   ```env
   SMTP_PORT=587
   ```

2. **If you get connection errors, try Port 465**

   ```env
   SMTP_PORT=465
   ```

3. **Your control panel should tell you which port to use**
   - Check the "Outgoing Mail Server" settings
   - It will specify "Port 587" or "Port 465"

---

## Part 5: Complete .env Configuration Examples

### Example 1: Standard Webmail Setup (Most Common)

```env
# SMTP Server Configuration
SMTP_HOST=mail.afresh.academy
SMTP_PORT=587
SMTP_USER=support@afresh.academy
SMTP_PASS=your-email-password-here

# Optional: If you get certificate errors
SMTP_TLS_REJECT_UNAUTHORIZED=false

# Optional: Enable debugging (shows detailed connection logs)
SMTP_DEBUG=true
```

### Example 2: SSL Connection (Alternative)

```env
SMTP_HOST=mail.afresh.academy
SMTP_PORT=465
SMTP_USER=support@afresh.academy
SMTP_PASS=your-email-password-here
```

### Example 3: Different Mail Server

```env
SMTP_HOST=smtp.afresh.academy
SMTP_PORT=587
SMTP_USER=support@afresh.academy
SMTP_PASS=your-email-password-here
```

---

## Part 6: Troubleshooting Guide

### Problem: "Unexpected socket close" Error

**Try these solutions in order:**

1. **Check your SMTP_HOST**

   ```env
   # Try these one at a time:
   SMTP_HOST=mail.afresh.academy
   # OR
   SMTP_HOST=smtp.afresh.academy
   ```

2. **Check your SMTP_PORT**

   ```env
   # Try port 587 first:
   SMTP_PORT=587
   # If that fails, try:
   SMTP_PORT=465
   ```

3. **Disable TLS certificate validation** (if you get cert errors)

   ```env
   SMTP_TLS_REJECT_UNAUTHORIZED=false
   ```

4. **Enable debugging** to see what's happening

   ```env
   SMTP_DEBUG=true
   ```

   - Restart your server
   - Try sending an email
   - Check the console output for detailed connection information

5. **Verify your credentials**
   - Make sure `SMTP_USER` is the full email: `support@afresh.academy`
   - Make sure `SMTP_PASS` is correct (copy-paste to avoid typos)

### Problem: "Authentication failed" Error

- **Check**: Your email password is correct
- **Check**: You're using the full email address as `SMTP_USER`
- **Try**: Changing your email password and updating it in `.env`
- **Note**: Some providers require "App Passwords" instead of regular passwords

### Problem: "Connection timeout" Error

- **Check**: Your firewall isn't blocking the SMTP port
- **Check**: Your hosting allows SMTP connections from your server IP
- **Contact**: Your hosting provider to verify SMTP access is enabled

---

## Part 7: Quick Reference

### Your `.env` File Should Look Like:

```env
# Email Configuration
SMTP_HOST=mail.afresh.academy
SMTP_PORT=587
SMTP_USER=support@afresh.academy
SMTP_PASS=your-password-here

# Optional Debugging
SMTP_DEBUG=true
```

### Where to Find These Settings:

- **SMTP_HOST**: Control Panel → Email Settings → Outgoing Mail Server
- **SMTP_PORT**: Control Panel → Email Settings → Port (usually 587)
- **SMTP_USER**: Your full email address
- **SMTP_PASS**: Your email account password

### Still Having Issues?

1. Enable `SMTP_DEBUG=true` and check the console output
2. Contact your hosting provider's support
3. Ask them: "What are the SMTP settings for support@afresh.academy?"

---

## Summary

**To find your SMTP settings:**

1. Log into your hosting control panel (cPanel, Plesk, etc.)
2. Go to Email/Mail settings
3. Find "Outgoing Mail Server" or "SMTP Server"
4. Copy the server name (usually `mail.afresh.academy` or `smtp.afresh.academy`)
5. Note the port (usually 587 or 465)
6. Use your full email address and password

**Most likely settings for you:**

- SMTP_HOST: `mail.afresh.academy`
- SMTP_PORT: `587`
- SMTP_USER: `support@afresh.academy`
- SMTP_PASS: Your email password

---

**Need More Help?** Enable `SMTP_DEBUG=true` in your `.env` file to see detailed connection logs that will help diagnose the issue.
