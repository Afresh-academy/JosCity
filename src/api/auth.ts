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
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountType: "personal",
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
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountType: "business",
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
