import { API_BASE_URL } from '../api/config';

// Public API functions (no authentication required)
const publicApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  let response: Response;
  
  try {
    response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });
  } catch (fetchError: any) {
    // Handle network errors gracefully
    if (fetchError.name === 'AbortError' || fetchError.name === 'TimeoutError') {
      throw new Error("Request timed out. Please check your connection.");
    }
    if (fetchError.message?.includes('Failed to fetch') || fetchError.message?.includes('ECONNREFUSED')) {
      console.warn(`[Public API] Backend unavailable for ${endpoint} at ${fullUrl}`);
      throw new Error(`Unable to connect to backend at ${fullUrl}. Please ensure the backend is running and VITE_API_URL is configured correctly.`);
    }
    throw new Error(`Network error: ${fetchError.message || 'Connection failed'}`);
  }

  // Check response content type before parsing
  const contentType = response.headers.get("content-type");
  const text = await response.text().catch(() => "");
  
  // If we got HTML instead of JSON, it means the URL is wrong (likely hitting frontend server)
  if (contentType && contentType.includes("text/html")) {
    console.error(`[Public API] Received HTML instead of JSON from ${fullUrl}`);
    console.error(`Response preview:`, text.substring(0, 200));
    throw new Error(
      `Server returned HTML instead of JSON. This usually means the backend URL is incorrect. ` +
      `Current API URL: ${API_BASE_URL}. ` +
      `Please check that VITE_API_URL is set correctly in your environment variables. ` +
      `Expected format: https://your-backend.onrender.com/api`
    );
  }

  if (!response.ok) {
    let errorData: any;
    
    if (contentType && contentType.includes("application/json") && text.trim()) {
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { error: response.statusText };
      }
    } else {
      errorData = { error: text || response.statusText };
    }
    
    throw new Error(errorData.error || `API Error: ${response.statusText} (Status: ${response.status})`);
  }

  if (contentType && contentType.includes("application/json") && text.trim()) {
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Response text:", text.substring(0, 200));
      throw new Error("Invalid JSON response from server");
    }
  }
  
  // If we get here, response was ok but not JSON
  console.error(`[Public API] Unexpected response format from ${fullUrl}`);
  console.error(`Content-Type: ${contentType || 'unknown'}`);
  console.error(`Response preview:`, text.substring(0, 200));
  throw new Error(
    `Server returned unexpected format. Expected JSON but got: ${contentType || "unknown"}. ` +
    `Please check if the backend is running at ${fullUrl}`
  );
};

// Public Hero API
export const publicHeroApi = {
  getSettings: () => publicApiRequest('/landing-page/hero/settings'),
  getSlides: () => publicApiRequest('/landing-page/hero/slides'),
};

// Public Events API
export const publicEventsApi = {
  getSettings: () => publicApiRequest('/landing-page/events/settings'),
  getEvents: () => publicApiRequest('/landing-page/events'),
  getEvent: (id: string) => publicApiRequest(`/landing-page/events/${id}`),
};

// Public Services API
export const publicServicesApi = {
  getSettings: () => publicApiRequest('/landing-page/services/settings'),
  getServices: () => publicApiRequest('/landing-page/services'),
};

// Public Pricing API
export const publicPricingApi = {
  getSettings: () => publicApiRequest('/landing-page/pricing/settings'),
  getPlans: () => publicApiRequest('/landing-page/pricing/plans'),
  getPlanFeatures: (planId: string) => publicApiRequest(`/landing-page/pricing/plans/${planId}/features`),
};

// Public Guidelines API
export const publicGuidelinesApi = {
  getSettings: () => publicApiRequest('/landing-page/guidelines/settings'),
  getGuidelines: () => publicApiRequest('/landing-page/guidelines'),
};

// Public Contact API
export const publicContactApi = {
  getSettings: () => publicApiRequest('/landing-page/contact/settings'),
  getInformation: () => publicApiRequest('/landing-page/contact/information'),
};

// Public Footer API
export const publicFooterApi = {
  getSettings: () => publicApiRequest('/landing-page/footer/settings'),
  getLinks: () => publicApiRequest('/landing-page/footer/links'),
};

// Public Navbar API
export const publicNavbarApi = {
  getMenuItems: () => publicApiRequest('/landing-page/navbar/menu-items'),
  getSettings: () => publicApiRequest('/landing-page/navbar/settings'),
};

// Public Stats API
export const publicStatsApi = {
  getRegisteredCitizensCount: () => publicApiRequest('/landing-page/stats/registered-citizens'),
};

