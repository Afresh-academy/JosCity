-- Active: 1763208524830@@sql5.freesqldatabase.com@3306@sql5807808
# Business Registration Backend - Complete Documentation

## 📋 Table of Contents
1. [Process Description](#process-description)
2. [Security Features](#security-features)
3. [Error Handling](#error-handling)
4. [API Endpoints](#api-endpoints)
5. [Thunder Client Testing Guide](#thunder-client-testing-guide)

---

## 🔄 Process Description

### Business Registration Flow

The business registration process follows these precise steps:

#### **Step 1: Request Reception**
- Client sends POST request to `/api/business/register` with business registration data
- Server receives request through Express middleware (CORS enabled, JSON parsing)

#### **Step 2: Input Validation**
The system performs comprehensive validation:

1. **Required Field Check**: Validates all 8 required fields:
   - `business_name`
   - `business_location`
   - `phone_number`
   - `email`
   - `CAC_number`
   - `address`
   - `password`
   - `type_of_business`

2. **Input Sanitization**: 
   - Trims whitespace from all inputs
   - Converts email to lowercase
   - Converts CAC number to uppercase
   - Removes potential XSS characters (`<`, `>`)

3. **Format Validation**:
   - **Email**: Validates using regex pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - **Phone Number**: Validates international/local formats
   - **Password**: Enforces strength requirements (min 8 chars, uppercase, lowercase, number)
   - **CAC Number**: Validates alphanumeric format (6-12 characters)

4. **Length Validation**: Ensures field lengths don't exceed database constraints (255 chars for VARCHAR fields)

#### **Step 3: Security Checks**
- **Duplicate Email Check**: Queries database to ensure email doesn't exist
- **Duplicate CAC Number Check**: Ensures CAC number is unique
- **Duplicate Phone Number Check**: Prevents duplicate phone registrations
- All queries use **parameterized statements** to prevent SQL injection

#### **Step 4: Password Hashing**
- Password is hashed using `bcrypt` with 12 salt rounds
- Original password is never stored in database

#### **Step 5: Database Transaction**
- Transaction begins to ensure data consistency
- Business record inserted with `account_status = 'pending'`
- Transaction commits on success, rolls back on error

#### **Step 6: Email Notification**
- Sends confirmation email to business owner
- Email includes registration details and status
- Email failure doesn't fail registration (logged only)

#### **Step 7: Response**
- Returns 201 status with success message
- Includes business_id and registration status
- Returns sanitized business data (no password)

---

## 🔒 Security Features

### 1. **SQL Injection Prevention**
- ✅ All database queries use parameterized statements
- ✅ User input is never directly concatenated into SQL queries
- ✅ Example: `db.execute("SELECT * FROM table WHERE email = ?", [email])`

### 2. **XSS (Cross-Site Scripting) Prevention**
- ✅ Input sanitization removes `<` and `>` characters
- ✅ All string inputs are trimmed
- ✅ Email and CAC numbers are normalized (lowercase/uppercase)

### 3. **Password Security**
- ✅ Passwords are hashed using bcrypt (12 salt rounds)
- ✅ Password strength validation enforced
- ✅ Original passwords never stored or returned in responses

### 4. **Input Validation**
- ✅ Comprehensive format validation for all fields
- ✅ Length constraints enforced
- ✅ Type checking and sanitization

### 5. **Duplicate Prevention**
- ✅ Email uniqueness check
- ✅ CAC number uniqueness check
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
  "missing_fields": { ... }
}
```

### Format Validation Errors (400 Bad Request)
- Invalid email format
- Invalid phone number format
- Weak password
- Invalid CAC number format
- Field length exceeded

### Conflict Errors (409 Conflict)
- Email already registered
- CAC number already registered
- Phone number already registered
- Duplicate entry detected

### Server Errors (500 Internal Server Error)
- Database connection failures
- Transaction failures
- Unexpected errors (generic message returned)

### Not Found Errors (404 Not Found)
- Business profile not found (for GET requests)

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

### 1. Register Business
**POST** `/api/business/register`

**Request Body:**
```json
{
  "business_name": "JOSCITY Enterprises",
  "business_location": "Lagos, Nigeria",
  "phone_number": "+2348012345678",
  "email": "contact@joscity.com",
  "CAC_number": "RC123456",
  "address": "123 Business Street, Lagos",
  "password": "SecurePass123",
  "business_type": "Technology Services"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Business registration submitted for review. You will receive an email once approved.",
  "business_id": 1,
  "status": "under_review",
  "data": {
    "business_name": "JOSCITY Enterprises",
    "email": "contact@joscity.com",
    "CAC_number": "RC123456"
  }
}
```

### 2. Get Business Profile
**GET** `/api/business/profile/:business_id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "business_id": 1,
    "business_name": "JOSCITY Enterprises",
    "business_location": "Lagos, Nigeria",
    "phone_number": "+2348012345678",
    "email": "contact@joscity.com",
    "CAC_number": "RC123456",
    "address": "123 Business Street, Lagos",
    "type_of_business": "Technology Services",
    "account_status": "pending",
    "is_verified": false,
    "business_registered": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Get Pending Businesses (Admin)
**GET** `/api/business/admin/pending`

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "business_id": 1,
      "business_name": "JOSCITY Enterprises",
      "business_location": "Lagos, Nigeria",
      "phone_number": "+2348012345678",
      "email": "contact@joscity.com",
      "CAC_number": "RC123456",
      "address": "123 Business Street, Lagos",
      "type_of_business": "Technology Services",
      "business_registered": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 🧪 Thunder Client Testing Guide

### Prerequisites
1. Install Thunder Client extension in VS Code
2. Ensure your Node.js server is running (`npm start` or `node server.js`)
3. Server should be running on `http://localhost:3000` (or your configured PORT)

---

### Step-by-Step Testing Instructions

#### **Step 1: Open Thunder Client**
1. Click the Thunder Client icon in VS Code sidebar (lightning bolt icon)
2. If not visible, press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
3. Type "Thunder Client" and select "Thunder Client: New Request"

#### **Step 2: Test Business Registration (Success Case)**

1. **Create New Request**:
   - Click "New Request" button in Thunder Client
   - Name it: "Register Business - Success"

2. **Configure Request**:
   - **Method**: Select `POST` from dropdown
   - **URL**: Enter `http://localhost:3000/api/business/register`
   - **Headers**: 
     - Click "Headers" tab
     - Add: `Content-Type: application/json`

3. **Add Request Body**:
   - Click "Body" tab
   - Select "JSON" format
   - Paste this test data:
   ```json
   {
     "business_name": "JOSCITY Tech Solutions",
     "business_location": "Abuja, Nigeria",
     "phone_number": "+2348123456789",
     "email": "test@joscity.com",
     "CAC_number": "RC789012",
     "address": "456 Innovation Drive, Abuja",
     "password": "SecurePass123",
     "type_of_business": "Software Development"
   }
   ```

4. **Send Request**:
   - Click "Send" button
   - Wait for response

5. **Verify Response**:
   - Status should be `201 Created`
   - Response body should show:
     ```json
     {
       "success": true,
       "message": "Business registration submitted for review...",
       "business_id": 1,
       "status": "under_review"
     }
     ```

#### **Step 3: Test Validation Errors**

**Test 3a: Missing Required Fields**
1. Create new request: "Register Business - Missing Fields"
2. Method: `POST`
3. URL: `http://localhost:3000/api/business/register`
4. Body (missing email and password):
   ```json
   {
     "business_name": "Test Business",
     "business_location": "Lagos",
     "phone_number": "+2348123456789",
     "CAC_number": "RC111111",
     "address": "123 Street",
     "type_of_business": "Retail"
   }
   ```
5. Expected: `400 Bad Request` with missing_fields object

**Test 3b: Invalid Email Format**
1. Create new request: "Register Business - Invalid Email"
2. Use same URL and method
3. Body with invalid email:
   ```json
   {
     "business_name": "Test Business",
     "business_location": "Lagos",
     "phone_number": "+2348123456789",
     "email": "invalid-email",
     "CAC_number": "RC111111",
     "address": "123 Street",
     "password": "SecurePass123",
     "type_of_business": "Retail"
   }
   ```
4. Expected: `400 Bad Request` - "Invalid email format"

**Test 3c: Weak Password**
1. Create new request: "Register Business - Weak Password"
2. Body with weak password:
   ```json
   {
     "business_name": "Test Business",
     "business_location": "Lagos",
     "phone_number": "+2348123456789",
     "email": "test2@example.com",
     "CAC_number": "RC222222",
     "address": "123 Street",
     "password": "weak",
     "type_of_business": "Retail"
   }
   ```
3. Expected: `400 Bad Request` - Password strength error

#### **Step 4: Test Duplicate Registration**

1. **First Registration**:
   - Use the success case from Step 2
   - Note the email used (e.g., `test@joscity.com`)

2. **Duplicate Registration**:
   - Create new request: "Register Business - Duplicate Email"
   - Use same email but different CAC number:
   ```json
   {
     "business_name": "Different Business",
     "business_location": "Lagos",
     "phone_number": "+2348123456789",
     "email": "test@joscity.com",
     "CAC_number": "RC999999",
     "address": "123 Street",
     "password": "SecurePass123",
     "type_of_business": "Retail"
   }
   ```
3. Expected: `409 Conflict` - "Email already registered"

#### **Step 5: Test Get Business Profile**

1. **Create New Request**:
   - Name: "Get Business Profile"
   - Method: `GET`
   - URL: `http://localhost:3000/api/business/profile/1`
   - (Replace `1` with actual business_id from Step 2)

2. **Send Request**:
   - Expected: `200 OK` with business data (no password field)

3. **Test Invalid ID**:
   - URL: `http://localhost:3000/api/business/profile/99999`
   - Expected: `404 Not Found`

#### **Step 6: Test Get Pending Businesses**

1. **Create New Request**:
   - Name: "Get Pending Businesses"
   - Method: `GET`
   - URL: `http://localhost:3000/api/business/admin/pending`

2. **Send Request**:
   - Expected: `200 OK` with array of pending businesses
   - Should include count and data array

#### **Step 7: Test Edge Cases**

**Test 7a: SQL Injection Attempt**
1. Body with SQL injection attempt:
   ```json
   {
     "business_name": "Test'; DROP TABLE business_profile; --",
     "business_location": "Lagos",
     "phone_number": "+2348123456789",
     "email": "sqlinject@test.com",
     "CAC_number": "RC333333",
     "address": "123 Street",
     "password": "SecurePass123",
     "type_of_business": "Retail"
   }
   ```
2. Expected: Should be sanitized and treated as normal string (no SQL execution)

**Test 7b: XSS Attempt**
1. Body with XSS attempt:
   ```json
   {
     "business_name": "<script>alert('XSS')</script>",
     "business_location": "Lagos",
     "phone_number": "+2348123456789",
     "email": "xss@test.com",
     "CAC_number": "RC444444",
     "address": "123 Street",
     "password": "SecurePass123",
     "type_of_business": "Retail"
   }
   ```
2. Expected: Script tags should be removed from stored data

**Test 7c: Very Long Input**
1. Body with extremely long business_name (300+ characters)
2. Expected: `400 Bad Request` - "Business name is too long"

---

### Thunder Client Tips

1. **Save Collections**: 
   - Create a collection named "Business API Tests"
   - Save all requests to this collection for easy reuse

2. **Environment Variables**:
   - Create environment with variable `baseUrl = http://localhost:3000`
   - Use `{{baseUrl}}/api/business/register` in URLs

3. **View Response Details**:
   - Check "Headers" tab for response headers
   - Check "Time" tab for request duration
   - Check "Logs" tab for detailed request/response logs

4. **Export/Import**:
   - Export your collection to share with team
   - Import collections from JSON files

5. **Test Sequences**:
   - Use "Run Collection" to test multiple requests in sequence
   - Set up test scripts for automated testing

---

### Expected Test Results Summary

| Test Case | Method | Expected Status | Expected Message |
|-----------|--------|----------------|------------------|
| Valid Registration | POST | 201 | "Business registration submitted..." |
| Missing Fields | POST | 400 | "All fields are required" |
| Invalid Email | POST | 400 | "Invalid email format" |
| Weak Password | POST | 400 | "Password must be at least 8 characters..." |
| Duplicate Email | POST | 409 | "Email already registered" |
| Duplicate CAC | POST | 409 | "CAC number already registered" |
| Get Profile (Valid) | GET | 200 | Business data object |
| Get Profile (Invalid) | GET | 404 | "Business not found" |
| Get Pending | GET | 200 | Array of pending businesses |

---

## 📝 Notes

- All passwords must meet strength requirements
- Email addresses are case-insensitive (stored lowercase)
- CAC numbers are stored uppercase
- Business accounts start with `pending` status
- Activation codes are sent via email after admin approval
- Database transactions ensure data integrity
- All sensitive operations are logged for security auditing

---

## 🔧 Troubleshooting

### Common Issues

1. **Connection Refused**:
   - Ensure server is running
   - Check PORT in `.env` file
   - Verify URL is correct

2. **Database Errors**:
   - Check database connection in `.env`
   - Verify `business_profile` table exists
   - Check database credentials

3. **Email Not Sending**:
   - Check SMTP configuration in `.env`
   - Verify email credentials
   - Check email service logs

4. **Validation Errors**:
   - Ensure all required fields are present
   - Check field formats match requirements
   - Verify password meets strength criteria

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0

