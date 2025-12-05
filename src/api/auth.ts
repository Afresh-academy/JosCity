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
        user_firstname: formData.user_firstname,
        user_lastname: formData.user_lastname,
        user_gender: formData.user_gender,
        user_phone: formData.user_phone,
        user_email: formData.user_email,
        nin_number: formData.nin_number,
        address: formData.address,
        user_password: formData.user_password,
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
        business_name: formData.business_name,
        business_type: formData.business_type,
        user_email: formData.business_email,
        CAC_number: formData.CAC_number,
        user_phone: formData.business_phone,
        business_location_: formData.business_location,
        user_password: formData.business_password,
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
