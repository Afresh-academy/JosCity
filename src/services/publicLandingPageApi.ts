import { API_BASE_URL } from '../api/config';

// Public API functions (no authentication required)
const publicApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
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

