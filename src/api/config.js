/**
 * @type {string}
 * In Vite, environment variables must be prefixed with VITE_ to be exposed to client-side code.
 * Use VITE_API_BASE_URL in your .env file (e.g., VITE_API_BASE_URL=https://your-backend-url.com/api)
 */
const getApiBaseUrl = () => {
  // Check for Vite environment variable first (for production/hosted backend)
  const viteUrl =
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BASE_URL;

  if (viteUrl) {
    // Remove trailing slash if present to avoid double slashes
    return viteUrl.replace(/\/+$/, "");
  }

  // Fallback to relative path for local development (uses Vite proxy)
  return "/api";
};

export const API_BASE_URL = getApiBaseUrl();
