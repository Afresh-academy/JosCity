// Validation schemas for Personal and Business registration forms

export interface ValidationError {
  field: string;
  message: string;
}

// Personal Form Validation Schema
export interface PersonalFormData {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  email: string;
  ninNumber: string;
  address: string;
  password: string;
}

// Business Form Validation Schema
export interface BusinessFormData {
  businessName: string;
  businessType: string;
  businessEmail: string;
  cacNumber: string;
  businessPhone: string;
  businessAddress: string;
  businessPassword: string;
}

// Validation functions
export const validatePersonalForm = (
  data: PersonalFormData
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // First Name validation
  if (!data.firstName || data.firstName.trim() === "") {
    errors.push({ field: "firstName", message: "First name is required" });
  } else if (data.firstName.trim().length < 2) {
    errors.push({
      field: "firstName",
      message: "First name must be at least 2 characters",
    });
  }

  // Last Name validation
  if (!data.lastName || data.lastName.trim() === "") {
    errors.push({ field: "lastName", message: "Last name is required" });
  } else if (data.lastName.trim().length < 2) {
    errors.push({
      field: "lastName",
      message: "Last name must be at least 2 characters",
    });
  }

  // Gender validation
  if (!data.gender || data.gender === "") {
    errors.push({ field: "gender", message: "Gender is required" });
  } else if (!["male", "female"].includes(data.gender)) {
    errors.push({ field: "gender", message: "Please select a valid gender" });
  }

  // Phone Number validation
  if (!data.phoneNumber || data.phoneNumber.trim() === "") {
    errors.push({ field: "phoneNumber", message: "Phone number is required" });
  } else {
    const phoneRegex =
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(data.phoneNumber.replace(/\s/g, ""))) {
      errors.push({
        field: "phoneNumber",
        message: "Please enter a valid phone number",
      });
    }
  }

  // Email validation
  if (!data.email || data.email.trim() === "") {
    errors.push({ field: "email", message: "Email is required" });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push({
        field: "email",
        message: "Please enter a valid email address",
      });
    }
  }

  // NIN Number validation
  if (!data.ninNumber || data.ninNumber.trim() === "") {
    errors.push({ field: "ninNumber", message: "NIN number is required" });
  } else if (data.ninNumber.trim().length < 11) {
    errors.push({
      field: "ninNumber",
      message: "NIN number must be at least 11 characters",
    });
  }

  // Address validation
  if (!data.address || data.address.trim() === "") {
    errors.push({ field: "address", message: "Address is required" });
  } else if (data.address.trim().length < 10) {
    errors.push({
      field: "address",
      message: "Address must be at least 10 characters",
    });
  }

  // Password validation
  if (!data.password || data.password === "") {
    errors.push({ field: "password", message: "Password is required" });
  } else if (data.password.length < 8) {
    errors.push({
      field: "password",
      message: "Password must be at least 8 characters",
    });
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
    errors.push({
      field: "password",
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    });
  }

  return errors;
};

export const validateBusinessForm = (
  data: BusinessFormData
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Business Name validation
  if (!data.businessName || data.businessName.trim() === "") {
    errors.push({
      field: "businessName",
      message: "Business name is required",
    });
  } else if (data.businessName.trim().length < 2) {
    errors.push({
      field: "businessName",
      message: "Business name must be at least 2 characters",
    });
  }

  // Business Type validation
  if (!data.businessType || data.businessType === "") {
    errors.push({
      field: "businessType",
      message: "Business type is required",
    });
  } else if (
    !["retail", "service", "manufacturing", "other"].includes(data.businessType)
  ) {
    errors.push({
      field: "businessType",
      message: "Please select a valid business type",
    });
  }

  // Business Email validation
  if (!data.businessEmail || data.businessEmail.trim() === "") {
    errors.push({
      field: "businessEmail",
      message: "Business email is required",
    });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.businessEmail)) {
      errors.push({
        field: "businessEmail",
        message: "Please enter a valid email address",
      });
    }
  }

  // CAC Number validation (required for business accounts)
  if (!data.cacNumber || data.cacNumber.trim() === "") {
    errors.push({
      field: "cacNumber",
      message: "CAC number is required for business accounts",
    });
  } else if (data.cacNumber.trim().length < 5) {
    errors.push({
      field: "cacNumber",
      message: "CAC number must be at least 5 characters",
    });
  }

  // Business Phone validation
  if (!data.businessPhone || data.businessPhone.trim() === "") {
    errors.push({
      field: "businessPhone",
      message: "Business phone is required",
    });
  } else {
    const phoneRegex =
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(data.businessPhone.replace(/\s/g, ""))) {
      errors.push({
        field: "businessPhone",
        message: "Please enter a valid phone number",
      });
    }
  }

  // Business Address validation
  if (!data.businessAddress || data.businessAddress.trim() === "") {
    errors.push({
      field: "businessAddress",
      message: "Business address is required",
    });
  } else if (data.businessAddress.trim().length < 10) {
    errors.push({
      field: "businessAddress",
      message: "Business address must be at least 10 characters",
    });
  }

  // Business Password validation
  if (!data.businessPassword || data.businessPassword === "") {
    errors.push({ field: "businessPassword", message: "Password is required" });
  } else if (data.businessPassword.length < 8) {
    errors.push({
      field: "businessPassword",
      message: "Password must be at least 8 characters",
    });
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.businessPassword)) {
    errors.push({
      field: "businessPassword",
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    });
  }

  return errors;
};

// Helper function to get error message for a specific field
export const getFieldError = (
  errors: ValidationError[],
  fieldName: string
): string | undefined => {
  const error = errors.find((err) => err.field === fieldName);
  return error?.message;
};
