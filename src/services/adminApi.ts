import { API_BASE_URL } from "../api/config";

// Admin login types
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    display_name: string;
    user_group: number;
    is_admin: boolean;
    is_moderator: boolean;
    account_type: string;
    is_verified: boolean;
    has_verified_badge: boolean;
  };
}

// Database statistics types
export interface DatabaseStats {
  users: {
    total_users: number;
    pending_users: number;
    approved_users: number;
    rejected_users: number;
    suspended_users: number;
    personal_accounts: number;
    business_accounts: number;
    admins: number;
    moderators: number;
    verified_users: number;
    banned_users: number;
  };
  recent_registrations: number;
  active_users_24h: number;
}

// User types
export interface User {
  user_id: number;
  user_name: string;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  user_phone: string;
  user_gender: string;
  address: string;
  account_type: string;
  account_status: string;
  nin_number?: string;
  business_name?: string;
  business_type?: string;
  CAC_number?: string;
  business_location?: string;
  user_approved: boolean;
  user_activated: boolean;
  user_banned: boolean;
  user_verified: boolean;
  user_group: number;
  is_verified: boolean;
  user_registered: string;
  user_last_seen?: string;
  last_login?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

// Generic API request helper with admin authentication
const adminApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token =
    localStorage.getItem("adminToken") || localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });
  } catch (networkError: any) {
    // Handle network errors gracefully
    if (
      networkError.name === "AbortError" ||
      networkError.name === "TimeoutError"
    ) {
      throw new Error(
        "Request timed out. Please check your connection and try again."
      );
    }
    if (
      networkError.message?.includes("Failed to fetch") ||
      networkError.message?.includes("ECONNREFUSED")
    ) {
      throw new Error(
        `Unable to connect to server. Please ensure the backend is running on port 3000.`
      );
    }
    throw new Error(
      `Network error: ${networkError.message || "Connection failed"}`
    );
  }

  // Check if response has content before parsing
  const contentType = response.headers.get("content-type");
  const text = await response.text().catch(() => "");

  let data: any;

  if (contentType && contentType.includes("application/json") && text.trim()) {
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      data = { error: response.statusText || "Invalid response format" };
    }
  } else if (text.trim()) {
    data = { error: text.substring(0, 200) || response.statusText };
  } else {
    if (response.ok) {
      data = { success: true };
    } else {
      throw new Error(
        `Server returned empty response (Status: ${response.status}). Please check if the backend is running.`
      );
    }
  }

  const getErrorMessage = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (typeof value === "boolean")
      return value ? "An error occurred" : "Request failed";
    if (value && typeof value === "object") {
      const errorObj = value as { message?: unknown; error?: unknown };
      if (errorObj.message) return String(errorObj.message);
      if (errorObj.error) return String(errorObj.error);
      return JSON.stringify(value);
    }
    return String(value || "Request failed");
  };

  if (!response.ok) {
    const errorMessage =
      getErrorMessage(data.error) ||
      getErrorMessage(data.message) ||
      `API Error: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  if (data.success === false) {
    const errorMessage =
      getErrorMessage(data.error) ||
      getErrorMessage(data.message) ||
      "Request failed";
    throw new Error(errorMessage);
  }

  return data;
};

// Admin API functions
export const adminApi = {
  // Admin login (no auth required)
  login: async (
    credentials: AdminLoginRequest
  ): Promise<AdminLoginResponse> => {
    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });
    } catch (fetchError: any) {
      // Handle network errors
      if (
        fetchError.name === "AbortError" ||
        fetchError.name === "TimeoutError"
      ) {
        throw new Error(
          "Request timed out. Please check your connection and try again."
        );
      }
      if (
        fetchError.message?.includes("Failed to fetch") ||
        fetchError.message?.includes("ECONNREFUSED")
      ) {
        throw new Error(
          "Unable to connect to server. Please ensure the backend is running on port 3000."
        );
      }
      throw new Error(
        `Network error: ${fetchError.message || "Connection failed"}`
      );
    }

    // Check if response has content before parsing
    const contentType = response.headers.get("content-type");
    const text = await response.text().catch(() => "");

    let data: any;

    // Only try to parse as JSON if content-type indicates JSON and text is not empty
    if (
      contentType &&
      contentType.includes("application/json") &&
      text.trim()
    ) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Response text:", text);
        throw new Error(
          `Server returned invalid JSON response. Please check if the backend is running correctly.`
        );
      }
    } else if (text.trim()) {
      // If not JSON but has content
      console.error("Non-JSON response:", text);
      throw new Error(
        `Server returned unexpected format. Expected JSON but got: ${
          contentType || "unknown"
        }. Please check if the backend is running.`
      );
    } else {
      // Empty response
      console.error("Empty response from server");
      throw new Error(
        `Server returned empty response (Status: ${response.status}). Please check if the backend is running and accessible at ${API_BASE_URL}/auth/admin/login`
      );
    }

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        data?.error ||
        `Admin login failed (${response.status}). Please try again.`;
      console.error("Login failed:", errorMessage);
      throw new Error(errorMessage);
    }

    if (data.success && data.token) {
      // Store admin token
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminData", JSON.stringify(data.admin));
      console.log("Admin login successful, token stored");
    } else if (data.success === false) {
      const errorMessage =
        data?.message ||
        data?.error ||
        "Admin login failed. Please check your credentials.";
      console.error("Login failed:", errorMessage);
      throw new Error(errorMessage);
    }

    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
  },

  // Check if admin is logged in
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem("adminToken");
  },

  // Get current admin data
  getCurrentAdmin: () => {
    const adminData = localStorage.getItem("adminData");
    return adminData ? JSON.parse(adminData) : null;
  },

  // Get admin token
  getToken: (): string | null => {
    return localStorage.getItem("adminToken");
  },

  // Database Statistics
  getDatabaseStats: async (): Promise<{
    success: boolean;
    data: DatabaseStats;
  }> => {
    return adminApiRequest("/admin/data/stats");
  },

  // Get all users with filters
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    account_type?: string;
    search?: string;
    sort_by?: string;
    sort_order?: "ASC" | "DESC";
  }): Promise<{
    success: boolean;
    data: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.account_type)
      queryParams.append("account_type", params.account_type);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params?.sort_order) queryParams.append("sort_order", params.sort_order);

    const queryString = queryParams.toString();
    const endpoint = `/admin/data/users${queryString ? `?${queryString}` : ""}`;
    return adminApiRequest(endpoint);
  },

  // Get database tables
  getDatabaseTables: async (): Promise<{
    success: boolean;
    data: { table_name: string; table_schema: string }[];
  }> => {
    return adminApiRequest("/admin/data/tables");
  },

  // Get table schema
  getTableSchema: async (
    tableName: string,
    schema: string = "joscity"
  ): Promise<{
    success: boolean;
    data: {
      table_name: string;
      schema: string;
      columns: Array<{
        column_name: string;
        data_type: string;
        character_maximum_length: number | null;
        is_nullable: string;
        column_default: string | null;
        ordinal_position: number;
      }>;
    };
  }> => {
    return adminApiRequest(
      `/admin/data/tables/${tableName}/schema?schema=${schema}`
    );
  },

  // Get table data
  getTableData: async (
    tableName: string,
    params?: {
      schema?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{
    success: boolean;
    data: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.schema) queryParams.append("schema", params.schema);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/admin/data/tables/${tableName}/data${
      queryString ? `?${queryString}` : ""
    }`;
    return adminApiRequest(endpoint);
  },

  // Execute custom query (read-only)
  executeQuery: async (
    query: string
  ): Promise<{
    success: boolean;
    data: any[];
    rowCount: number;
  }> => {
    return adminApiRequest("/admin/data/query", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  },
};
