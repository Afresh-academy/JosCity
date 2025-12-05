# API Calling for Registration Forms - Explanation

## Overview

Your registration system has two form components (`PersonalFormFields.tsx` and `BusinessFormFields.tsx`) that are both routed through a single parent component (`Register.tsx`). Here's how API calling would function for both forms.

---

## Current Architecture

### Component Structure

```
Register.tsx (Parent Component)
├── PersonalFormFields.tsx (Child - displays personal form fields)
└── BusinessFormFields.tsx (Child - displays business form fields)
```

### Current Flow

1. **Register.tsx** manages:

   - Form state (`formData` for personal, `businessFormData` for business)
   - Form validation
   - Form submission handler (`handleSubmit`)
   - Loading states
   - Error handling

2. **Form Components** (`PersonalFormFields.tsx` & `BusinessFormFields.tsx`):

   - Only display form fields (presentational components)
   - Receive form data and handlers via props
   - Don't handle submission themselves

3. **Current Submission** (Lines 73-123 in Register.tsx):
   - Uses `setTimeout` to simulate API call
   - Navigates to success page after "simulated" delay

---

## How API Calling Would Function

### Option 1: API Calls in Register.tsx (Recommended)

Since `Register.tsx` already handles all the form logic, the API calls would be made directly in the `handleSubmit` function.

#### Flow Diagram

```
User fills form → Clicks Submit
    ↓
handleSubmit() is triggered
    ↓
Form validation (client-side)
    ↓
If valid:
    - Set loading state (isLoading = true)
    - Determine form type (personal/business)
    - Prepare API payload
    - Make API call
    ↓
API Response:
    - Success → Navigate to success page / Login
    - Error → Display error message, set isLoading = false
```

#### Implementation Pattern

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setValidationErrors([]);

  if (registrationType === "personal") {
    // 1. Validate form
    const errors = validatePersonalForm(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setError("Please fix the errors in the form before submitting.");
      return;
    }

    // 2. Set loading state
    setIsLoading(true);

    try {
      // 3. Make API call
      const response = await fetch(`${API_BASE_URL}/auth/register/personal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          ninNumber: formData.ninNumber,
          address: formData.address,
          password: formData.password,
        }),
      });

      // 4. Handle response
      const data = await response.json();

      if (!response.ok) {
        // Handle API validation errors
        if (data.errors) {
          setValidationErrors(data.errors);
        }
        throw new Error(data.message || "Registration failed");
      }

      // 5. Success - Navigate or store auth token
      navigate("/success", {
        state: {
          submitted: true,
          accountType: "personal",
          email: formData.email,
        },
      });
    } catch (err) {
      // 6. Error handling
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration"
      );
    } finally {
      setIsLoading(false);
    }
  } else {
    // Same pattern for business form
    // ... business form API call
  }
};
```

---

### Option 2: Separate API Service Layer (Better for Large Apps)

Create dedicated API service functions to keep the component clean.

#### File Structure

```
src/
├── api/
│   ├── config.ts          # API base URL configuration
│   └── auth.ts            # Authentication API functions
├── services/
│   └── authService.ts     # Business logic layer (optional)
```

#### Example: `src/api/config.ts`

```typescript
// Get API base URL from environment variables
const API_BASE_URL =
  import.meta.env.APP_BASE_URL ||
  import.meta.env.VITE_BASE_URL ||
  "http://localhost:3000/api";

export default API_BASE_URL;
```

#### Example: `src/api/auth.ts`

```typescript
import API_BASE_URL from "./config";
import type {
  PersonalFormData,
  BusinessFormData,
} from "../utils/validationSchemas";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export const registerPersonal = async (
  formData: PersonalFormData
): Promise<ApiResponse<{ userId: string; email: string }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/personal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        ninNumber: formData.ninNumber,
        address: formData.address,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Registration failed",
        errors: data.errors || [],
      };
    }

    return {
      success: true,
      data: data.user,
      message: data.message || "Registration successful",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Network error occurred",
    };
  }
};

export const registerBusiness = async (
  formData: BusinessFormData
): Promise<ApiResponse<{ businessId: string; email: string }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/business`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessEmail: formData.businessEmail,
        cacNumber: formData.cacNumber,
        businessPhone: formData.businessPhone,
        businessAddress: formData.businessAddress,
        businessPassword: formData.businessPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Registration failed",
        errors: data.errors || [],
      };
    }

    return {
      success: true,
      data: data.business,
      message: data.message || "Registration successful",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Network error occurred",
    };
  }
};
```

#### Updated Register.tsx using API service

```typescript
import { registerPersonal, registerBusiness } from "../api/auth";

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setValidationErrors([]);

  if (registrationType === "personal") {
    // 1. Client-side validation
    const errors = validatePersonalForm(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setError("Please fix the errors in the form before submitting.");
      return;
    }

    // 2. Set loading
    setIsLoading(true);

    // 3. Call API service
    const result = await registerPersonal(formData);

    if (!result.success) {
      // 4. Handle errors
      if (result.errors && result.errors.length > 0) {
        setValidationErrors(result.errors);
      }
      setError(result.message || "Registration failed");
      setIsLoading(false);
      return;
    }

    // 5. Success
    navigate("/success", {
      state: {
        submitted: true,
        accountType: "personal",
        email: formData.email,
      },
    });
  } else {
    // Business form - same pattern
    const errors = validateBusinessForm(businessFormData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setError("Please fix the errors in the form before submitting.");
      return;
    }

    setIsLoading(true);
    const result = await registerBusiness(businessFormData);

    if (!result.success) {
      if (result.errors && result.errors.length > 0) {
        setValidationErrors(result.errors);
      }
      setError(result.message || "Registration failed");
      setIsLoading(false);
      return;
    }

    navigate("/success", {
      state: {
        submitted: true,
        accountType: "business",
        email: businessFormData.businessEmail,
      },
    });
  }
};
```

---

## API Endpoint Expectations

### Personal Registration Endpoint

**POST** `/api/auth/register/personal`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "gender": "male",
  "phoneNumber": "+2348123456789",
  "email": "john.doe@example.com",
  "ninNumber": "12345678901",
  "address": "123 Main Street, Jos",
  "password": "SecurePass123"
}
```

**Success Response (200/201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "user123",
    "email": "john.doe@example.com",
    "accountType": "personal"
  },
  "token": "jwt_token_here" // if using JWT authentication
}
```

**Error Response (400/422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

### Business Registration Endpoint

**POST** `/api/auth/register/business`

**Request Body:**

```json
{
  "businessName": "ABC Company Ltd",
  "businessType": "retail",
  "businessEmail": "contact@abccompany.com",
  "cacNumber": "RC123456",
  "businessPhone": "+2348123456789",
  "businessAddress": "456 Business Street, Jos",
  "businessPassword": "SecurePass123"
}
```

**Success Response (200/201):**

```json
{
  "success": true,
  "message": "Business registration successful",
  "business": {
    "id": "business123",
    "email": "contact@abccompany.com",
    "accountType": "business"
  },
  "token": "jwt_token_here"
}
```

**Error Response (400/422):**

```json
{
  "success": false,
  "message": "CAC number already registered",
  "errors": [
    {
      "field": "cacNumber",
      "message": "This CAC number is already registered"
    }
  ]
}
```

---

## Key Points

### 1. **Form Components Don't Make API Calls**

- `PersonalFormFields.tsx` and `BusinessFormFields.tsx` are **presentational components**
- They only display form fields and call `onInputChange` callback
- All logic stays in `Register.tsx`

### 2. **Single Source of Truth**

- `Register.tsx` manages all form state
- Single `handleSubmit` function handles both forms
- Form type is determined by `registrationType` state

### 3. **Two-Level Validation**

- **Client-side validation** (happens before API call)
  - Fast feedback to user
  - Reduces unnecessary API calls
- **Server-side validation** (API response)
  - Security and data integrity
  - Catches issues client validation might miss

### 4. **Error Handling Strategy**

- **Network errors**: Connection issues, timeout
- **Validation errors**: Server-side validation failures
- **Business logic errors**: Email exists, CAC number taken, etc.

### 5. **Loading States**

- Disable submit button during API call
- Show loading indicator
- Prevent duplicate submissions

---

## Recommended Implementation Steps

1. **Create API configuration** (`src/api/config.ts`)

   - Set up base URL from environment variables

2. **Create API service functions** (`src/api/auth.ts`)

   - `registerPersonal()` function
   - `registerBusiness()` function
   - Error handling and type definitions

3. **Update Register.tsx**

   - Replace `setTimeout` with actual API calls
   - Import API service functions
   - Update error handling to use API responses

4. **Test with backend**
   - Ensure backend endpoints match expected format
   - Test error scenarios (email exists, invalid data, etc.)

---

## Environment Variables Setup

Add to `.env` file:

```env
# Local development
VITE_BASE_URL=http://localhost:3000/api

# Production (set in deployment platform)
# VITE_BASE_URL=https://new-joscity.onrender.com/api
```

---

## Summary

- **Form Components**: Display-only, no API calls
- **Register.tsx**: Manages state, validation, and API calls
- **API Calls**: Made in `handleSubmit` after client-side validation
- **Error Handling**: Both client and server validation errors
- **Loading States**: Managed in Register.tsx with `isLoading` state

The forms follow a **controlled component pattern** where the parent (`Register.tsx`) maintains full control over form submission and API interactions.
