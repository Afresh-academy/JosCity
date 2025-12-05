// Validation schemas for Personal and Business registration forms

export interface ValidationError {
  field: string;
  message: string;
}

// Personal Form Validation Schema
export interface PersonalFormData {
  user_firstname: string;
  user_lastname: string;
  user_gender: string;
  user_phone: string;
  user_email: string;
  nin_number: string;
  address: string;
  user_password: string;
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
  if (!data.user_firstname || data.user_firstname.trim() === "") {
    errors.push({ field: "user_firstname", message: "First name is required" });
  } else if (data.user_firstname.trim().length < 2) {
    errors.push({
      field: "user_firstname",
      message: "First name must be at least 2 characters",
    });
  }

  // Last Name validation
  if (!data.user_lastname || data.user_lastname.trim() === "") {
    errors.push({ field: "user_lastname", message: "Last name is required" });
  } else if (data.user_lastname.trim().length < 2) {
    errors.push({
      field: "user_lastname",
      message: "Last name must be at least 2 characters",
    });
  }

  // Gender validation
  if (!data.user_gender || data.user_gender === "") {
    errors.push({ field: "user_gender", message: "Gender is required" });
  } else if (!["male", "female"].includes(data.user_gender)) {
    errors.push({ field: "user_gender", message: "Please select a valid gender" });
  }

  // Phone Number validation
  if (!data.user_phone || data.user_phone.trim() === "") {
    errors.push({ field: "user_phone", message: "Phone number is required" });
  } else {
    const phoneRegex =
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(data.user_phone.replace(/\s/g, ""))) {
      errors.push({
        field: "user_phone",
        message: "Please enter a valid phone number",
      });
    }
  }

  // Email validation
  if (!data.user_email || data.user_email.trim() === "") {
    errors.push({ field: "user_email", message: "Email is required" });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.user_email)) {
      errors.push({
        field: "user_email",
        message: "Please enter a valid email address",
      });
    }
  }

  // NIN Number validation
  if (!data.nin_number || data.nin_number.trim() === "") {
    errors.push({ field: "nin_number", message: "NIN number is required" });
  } else if (data.nin_number.trim().length < 11) {
    errors.push({
      field: "nin_number",
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
  if (!data.user_password || data.user_password === "") {
    errors.push({ field: "user_password", message: "Password is required" });
  } else if (data.user_password.length < 8) {
    errors.push({
      field: "user_password",
      message: "Password must be at least 8 characters",
    });
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.user_password)) {
    errors.push({
      field: "user_password",
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
