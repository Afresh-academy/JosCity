# Personal Registration Backend - Complete Documentation

## 📋 Table of Contents
1. [Process Description](#process-description)
2. [Security Features](#security-features)
3. [Error Handling](#error-handling)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Setup Instructions](#setup-instructions)

---

## 🔄 Process Description

### Personal Registration Flow

The personal registration process follows these precise steps:

#### **Step 1: Request Reception**
- Client sends POST request to `/api/personal/register` with personal registration data
- Server receives request through Express middleware (CORS enabled, JSON parsing)

#### **Step 2: Input Validation**
The system performs comprehensive validation:

1. **Required Field Check**: Validates all 8 required fields:
   - `first_name`
   - `last_name`
   - `gender`
   - `phone_number`
   - `email`
   - `nin_number`
   - `address`
   - `password`

2. **Input Sanitization**: 
   - Trims whitespace from all inputs
   - Converts email to lowercase
   - Converts gender to lowercase
   - Removes potential XSS characters (`<`, `>`)

3. **Format Validation**:
   - **Email**: Validates using regex pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - **Phone Number**: Validates international/local formats
   - **Password**: Enforces strength requirements (min 8 chars, uppercase, lowercase, number)
   - **NIN Number**: Validates 11-digit format
   - **Gender**: Validates enum values ('male' or 'female')

4. **Length Validation**: Ensures field lengths don't exceed database constraints (255 chars for VARCHAR fields)

#### **Step 3: Security Checks**
- **Duplicate Email Check**: Queries database to ensure email doesn't exist
- **Duplicate NIN Number Check**: Ensures NIN number is unique
- **Duplicate Phone Number Check**: Prevents duplicate phone registrations
- All queries use **parameterized statements** to prevent SQL injection

#### **Step 4: Password Hashing**
- Password is hashed using `bcrypt` with 12 salt rounds
- Original password is never stored in database

#### **Step 5: Database Transaction**
- Transaction begins to ensure data consistency
- Personal record inserted with `account_status = 'pending'`
- Transaction commits on success, rolls back on error

#### **Step 6: Email Notification**
- Sends confirmation email to user
- Email includes registration details and status
- Email failure doesn't fail registration (logged only)

#### **Step 7: Response**
- Returns 201 status with success message
- Includes personal_id and registration status
- Returns sanitized personal data (no password)

---

## 🔒 Security Features

### 1. **SQL Injection Prevention**
- ✅ All database queries use parameterized statements
- ✅ User input is never directly concatenated into SQL queries
- ✅ Example: `db.execute("SELECT * FROM table WHERE email = ?", [email])`

### 2. **XSS (Cross-Site Scripting) Prevention**
- ✅ Input sanitization removes `<` and `>` characters
- ✅ All string inputs are trimmed
- ✅ Email is normalized (lowercase)

### 3. **Password Security**
- ✅ Passwords are hashed using bcrypt (12 salt rounds)
- ✅ Password strength validation enforced
- ✅ Original passwords never stored or returned in responses

### 4. **Input Validation**
- ✅ Comprehensive format validation for all fields
- ✅ Length constraints enforced
- ✅ Type checking and sanitization
- ✅ NIN number format validation (11 digits)
- ✅ Gender enum validation

### 5. **Duplicate Prevention**
- ✅ Email uniqueness check
- ✅ NIN number uniqueness check
- ✅ Phone number uniqueness check

### 6. **Error Information Disclosure Prevention**
- ✅ Generic error messages for internal failures
- ✅ Detailed errors only for client-side validation issues
- ✅ Database errors logged but not exposed to client

### 7. **Transaction Safety**
- ✅ Database transactions ensure atomicity
- ✅ Rollback on any error prevents partial data insertion
- ✅ Connection properly released in finally block

---

## ⚠️ Error Handling

### Validation Errors (400 Bad Request)
```json
{
  "error": true,
  "message": "All fields are required",
  "missing_fields": {
    "first_name": false,
    "last_name": false,
    "gender": true,
    ...
  }
}
```

### Format Validation Errors (400 Bad Request)
- Invalid email format
- Invalid phone number format
- Weak password
- Invalid NIN number format (must be exactly 11 digits)
- Invalid gender (must be 'male' or 'female')
- Field length exceeded

### Conflict Errors (409 Conflict)
- Email already registered
- NIN number already registered
- Phone number already registered
- Duplicate entry detected

### Server Errors (500 Internal Server Error)
- Database connection failures
- Transaction failures
- Unexpected errors (generic message returned)

### Not Found Errors (404 Not Found)
- Personal profile not found (for GET requests)

### Error Response Structure
All errors follow this format:
```json
{
  "error": true,
  "message": "Human-readable error message"
}
```

---

## 📡 API Endpoints

### 1. Register Personal User
**POST** `/api/personal/register`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "gender": "male",
  "phone_number": "+2348012345678",
  "email": "john.doe@example.com",
  "nin_number": "12345678901",
  "address": "123 Main Street, Lagos, Nigeria",
  "password": "SecurePass123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Personal registration submitted for review. You will receive an email once approved.",
  "personal_id": 1,
  "status": "under_review",
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "nin_number": "12345678901"
  }
}
```

### 2. Get Personal Profile
**GET** `/api/personal/profile/:personal_id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "personal_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "gender": "male",
    "phone_number": "+2348012345678",
    "email": "john.doe@example.com",
    "nin_number": "12345678901",
    "address": "123 Main Street, Lagos, Nigeria",
    "account_status": "pending",
    "is_verified": false,
    "personal_registered": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Get Pending Personal Registrations (Admin)
**GET** `/api/personal/admin/pending`

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "personal_id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "gender": "male",
      "phone_number": "+2348012345678",
      "email": "john.doe@example.com",
      "nin_number": "12345678901",
      "address": "123 Main Street, Lagos, Nigeria",
      "personal_registered": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 🗄️ Database Schema

### Table: `personal_profile`

```sql
CREATE TABLE IF NOT EXISTS personal_profile (
    personal_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nin_number VARCHAR(255) NOT NULL,
    address TEXT,
    password VARCHAR(255) NOT NULL,
    account_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    activation_code VARCHAR(10) NULL,
    activation_expires DATETIME,
    is_verified BOOLEAN DEFAULT FALSE,
    personal_registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (account_status),
    INDEX idx_nin (nin_number),
    INDEX idx_email (email),
    INDEX idx_phone (phone_number),
    UNIQUE KEY unique_email (email),
    UNIQUE KEY unique_nin (nin_number),
    UNIQUE KEY unique_phone (phone_number)
);
```

### Field Descriptions

- **personal_id**: Auto-incrementing primary key
- **first_name**: User's first name (max 255 chars)
- **last_name**: User's last name (max 255 chars)
- **gender**: User's gender ('male' or 'female')
- **phone_number**: User's phone number (unique)
- **email**: User's email address (unique, lowercase)
- **nin_number**: National Identification Number (11 digits, unique)
- **address**: User's physical address (TEXT field)
- **password**: Bcrypt hashed password (255 chars for hash)
- **account_status**: Registration status ('pending', 'approved', 'rejected')
- **activation_code**: 6-digit code for account activation (nullable)
- **activation_expires**: Expiration datetime for activation code
- **is_verified**: Boolean flag for account verification
- **personal_registered**: Timestamp of registration

---

## 🚀 Setup Instructions

### Step 1: Create Database Table

Execute the SQL schema to create the `personal_profile` table:

```bash
mysql -u your_user -p your_database < Backend/personal_profile_schema.sql
```

Or run the SQL directly in your database client:

```sql
-- Copy and paste the contents of personal_profile_schema.sql
```

### Step 2: Verify Table Creation

Check that the table was created successfully:

```sql
SHOW TABLES LIKE 'personal_profile';
DESCRIBE personal_profile;
```

### Step 3: Start the Server

```bash
cd Backend
node server.js
```

The server should start and register the personal routes at `/api/personal/*`

### Step 4: Test the Endpoint

Use Thunder Client, Postman, or curl to test:

```bash
curl -X POST http://localhost:3000/api/personal/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "gender": "male",
    "phone_number": "+2348012345678",
    "email": "john.doe@example.com",
    "nin_number": "12345678901",
    "address": "123 Main Street, Lagos",
    "password": "SecurePass123"
  }'
```

---

## 📝 Field Validation Rules

### First Name / Last Name
- **Required**: Yes
- **Type**: String
- **Max Length**: 255 characters
- **Validation**: Non-empty after trimming

### Gender
- **Required**: Yes
- **Type**: Enum
- **Values**: 'male' or 'female'
- **Case**: Case-insensitive (converted to lowercase)

### Phone Number
- **Required**: Yes
- **Type**: String
- **Format**: International or local format
- **Validation**: Regex pattern for phone numbers
- **Uniqueness**: Must be unique

### Email
- **Required**: Yes
- **Type**: String
- **Format**: Valid email format
- **Case**: Stored lowercase
- **Uniqueness**: Must be unique

### NIN Number
- **Required**: Yes
- **Type**: String
- **Format**: Exactly 11 digits
- **Validation**: `/^[0-9]{11}$/`
- **Uniqueness**: Must be unique

### Address
- **Required**: Yes
- **Type**: Text
- **Validation**: Non-empty after trimming

### Password
- **Required**: Yes
- **Type**: String
- **Min Length**: 8 characters
- **Requirements**: 
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **Storage**: Bcrypt hash (12 salt rounds)

---

## 🔧 Troubleshooting

### Common Issues

1. **Table Not Found Error**:
   - Execute `personal_profile_schema.sql` to create the table
   - Verify database connection in `.env` file
   - Check table name spelling

2. **Duplicate Entry Errors**:
   - Email, NIN, or phone number already exists
   - Check existing records in database
   - Use different values for testing

3. **Validation Errors**:
   - Ensure all required fields are present
   - Check NIN number is exactly 11 digits
   - Verify password meets strength requirements
   - Check gender is 'male' or 'female'

4. **Database Connection Issues**:
   - Verify `.env` file has correct database credentials
   - Check database server is running
   - Verify network connectivity

5. **Email Not Sending**:
   - Check SMTP configuration in `.env`
   - Email failure doesn't block registration
   - Check server logs for email errors

---

## 🔗 Integration with Frontend

The frontend form in `BusinessForm.tsx` handles personal registration:

1. User fills out personal form fields
2. Form submission triggers POST to `/api/personal/register`
3. Frontend maps form fields to backend expected format:
   - `firstName` → `first_name`
   - `lastName` → `last_name`
   - `phoneNumber` → `phone_number`
   - `ninNumber` → `nin_number`
   - etc.

4. On success, user is redirected to success page
5. On error, error message is displayed to user

---

## 📊 Testing Checklist

- [ ] Valid registration with all fields
- [ ] Missing required fields validation
- [ ] Invalid email format
- [ ] Invalid phone number format
- [ ] Weak password validation
- [ ] Invalid NIN number format
- [ ] Invalid gender value
- [ ] Duplicate email check
- [ ] Duplicate NIN number check
- [ ] Duplicate phone number check
- [ ] Get personal profile (valid ID)
- [ ] Get personal profile (invalid ID)
- [ ] Get pending personal registrations
- [ ] SQL injection attempt (should be sanitized)
- [ ] XSS attempt (should be sanitized)

---

**Last Updated**: 2025-01-XX
**Version**: 1.0.0

