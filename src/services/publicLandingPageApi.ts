import { API_BASE_URL } from '../api/config';

// Public API functions (no authentication required)
const publicApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  let response: Response;
  
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
      // Silently fail for public endpoints - don't spam errors
      console.warn(`[Public API] Backend unavailable for ${endpoint}`);
      throw new Error("Service temporarily unavailable");
    }
    throw new Error(`Network error: ${fetchError.message || 'Connection failed'}`);
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    const text = await response.text().catch(() => "");
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
    
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  const text = await response.text().catch(() => "");
  
  if (contentType && contentType.includes("application/json") && text.trim()) {
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON response");
    }
  }
  
  throw new Error("Unexpected response format");
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

