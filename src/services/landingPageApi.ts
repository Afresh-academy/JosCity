import { API_BASE_URL } from "../api/config";

// Types for all landing page tables
export interface NavbarMenuItem {
  id?: string;
  label: string;
  link_type: "scroll" | "route" | "external";
  link_target?: string;
  scroll_target_id?: string;
  display_order: number;
  is_active: boolean;
  requires_auth: boolean;
  icon_name?: string;
}

export interface NavbarSettings {
  id?: string;
  logo_url?: string;
  logo_alt?: string;
  get_started_button_text?: string;
  get_started_button_route?: string;
  is_active: boolean;
}

export interface ContactPageSettings {
  id?: string;
  badge_text?: string;
  heading: string;
  subheading?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status?: "pending" | "read" | "replied" | "archived";
  reply_message?: string;
}

export interface ContactInformation {
  id?: string;
  contact_type: "phone" | "email" | "location";
  title: string;
  primary_value: string;
  secondary_value?: string;
  icon_color?: string;
  icon_background?: string;
  is_active: boolean;
  display_order: number;
}

export interface EventsPageSettings {
  id?: string;
  badge_text?: string;
  heading?: string;
  subheading?: string;
  default_image_url?: string;
}

export interface Event {
  id?: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  end_date?: string;
  end_time?: string;
  location?: string;
  venue?: string;
  image_url?: string;
  event_type?: string;
  status?: "upcoming" | "ongoing" | "completed" | "cancelled";
  max_attendees?: number;
  current_attendees?: number;
  ticket_price?: number;
  ticket_currency?: string;
  registration_required?: boolean;
  registration_deadline?: string;
  tags?: string[];
}

export interface EventRegistration {
  id?: string;
  event_id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  status?: "pending" | "confirmed" | "cancelled" | "attended";
  payment_status?: "pending" | "paid" | "refunded";
  payment_amount?: number;
  payment_reference?: string;
}

export interface ServicesPageSettings {
  id?: string;
  badge_text?: string;
  heading: string;
  subheading?: string;
  view_all_button_text?: string;
}

export interface Service {
  id?: string;
  service_key: string;
  title: string;
  description: string;
  icon_color: string;
  icon_svg?: string;
  category?: string;
  is_active: boolean;
  display_order: number;
  service_url?: string;
  requires_authentication?: boolean;
}

export interface ServiceRequest {
  id?: string;
  service_id: string;
  user_id?: string;
  request_type?: string;
  description: string;
  status?: "pending" | "in_progress" | "completed" | "rejected" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  assigned_to?: string;
  response?: string;
}

export interface PricingPageSettings {
  id?: string;
  badge_text?: string;
  heading: string;
  subheading?: string;
  subscribe_button_text?: string;
}

export interface PricingPlan {
  id?: string;
  plan_key: string;
  name: string;
  price: number;
  currency?: string;
  billing_period?: "monthly" | "yearly" | "one-time";
  is_popular?: boolean;
  is_active: boolean;
  display_order: number;
  description?: string;
}

export interface PricingPlanFeature {
  id?: string;
  plan_id: string;
  feature_name: string;
  is_included: boolean;
  display_order: number;
}

export interface UserSubscription {
  id?: string;
  user_id: string;
  plan_id: string;
  status?: "active" | "cancelled" | "expired" | "pending";
  start_date: string;
  end_date?: string;
  auto_renew?: boolean;
  payment_status?: string;
}

export interface GuidelinesPageSettings {
  id?: string;
  badge_text?: string;
  heading?: string;
}

export interface Guideline {
  id?: string;
  quote: string;
  author_name: string;
  author_role?: string;
  rating?: number;
  author_image_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface HeroPageSettings {
  id?: string;
  slide_duration_seconds?: number;
  auto_advance?: boolean;
  show_navigation_dots?: boolean;
  show_prev_next_arrows?: boolean;
  default_badge_text?: string;
  primary_button_text?: string;
  primary_button_route?: string;
  secondary_button_text?: string;
  secondary_button_route?: string;
}

export interface HeroSlide {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  image_alt?: string;
  slide_order: number;
  is_active: boolean;
  link_url?: string;
  link_text?: string;
  button_text?: string;
}

export interface FooterLink {
  id?: string;
  link_text: string;
  link_url: string;
  section: "quick_links" | "services" | "legal" | "social";
  display_order: number;
  is_active: boolean;
  opens_in_new_tab?: boolean;
}

export interface FooterSettings {
  id?: string;
  logo_url?: string;
  tagline?: string;
  copyright_text?: string;
  social_media?: Record<string, string>;
}

// Generic API functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // Get authentication token from localStorage
  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response
    .json()
    .catch(() => ({ error: response.statusText }));

  // Helper to convert error message to string
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

  // Check if response has success field and it's false
  if (data.success === false) {
    const errorMessage =
      getErrorMessage(data.error) ||
      getErrorMessage(data.message) ||
      "Request failed";
    throw new Error(errorMessage);
  }

  return data;
};

// Navbar API
export const navbarApi = {
  getMenuItems: () => apiRequest("/admin/landing-page/navbar/menu-items"),
  createMenuItem: (data: NavbarMenuItem) =>
    apiRequest("/admin/landing-page/navbar/menu-items", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateMenuItem: (id: string, data: Partial<NavbarMenuItem>) =>
    apiRequest(`/admin/landing-page/navbar/menu-items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteMenuItem: (id: string) =>
    apiRequest(`/admin/landing-page/navbar/menu-items/${id}`, {
      method: "DELETE",
    }),
  getSettings: () => apiRequest("/admin/landing-page/navbar/settings"),
  updateSettings: (data: Partial<NavbarSettings>) =>
    apiRequest("/admin/landing-page/navbar/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Contact API
export const contactApi = {
  getSettings: () => apiRequest("/admin/landing-page/contact/settings"),
  updateSettings: (data: Partial<ContactPageSettings>) =>
    apiRequest("/admin/landing-page/contact/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getMessages: () => apiRequest("/admin/landing-page/contact/messages"),
  getMessage: (id: string) =>
    apiRequest(`/admin/landing-page/contact/messages/${id}`),
  updateMessage: (id: string, data: Partial<ContactMessage>) =>
    apiRequest(`/admin/landing-page/contact/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteMessage: (id: string) =>
    apiRequest(`/admin/landing-page/contact/messages/${id}`, {
      method: "DELETE",
    }),
  getInformation: () => apiRequest("/admin/landing-page/contact/information"),
  createInformation: (data: ContactInformation) =>
    apiRequest("/admin/landing-page/contact/information", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateInformation: (id: string, data: Partial<ContactInformation>) =>
    apiRequest(`/admin/landing-page/contact/information/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteInformation: (id: string) =>
    apiRequest(`/admin/landing-page/contact/information/${id}`, {
      method: "DELETE",
    }),
};

// Events API
export const eventsApi = {
  getSettings: () => apiRequest("/admin/landing-page/events/settings"),
  updateSettings: (data: Partial<EventsPageSettings>) =>
    apiRequest("/admin/landing-page/events/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getEvents: () => apiRequest("/admin/landing-page/events"),
  getEvent: (id: string) => apiRequest(`/admin/landing-page/events/${id}`),
  createEvent: (data: Event) =>
    apiRequest("/admin/landing-page/events", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateEvent: (id: string, data: Partial<Event>) =>
    apiRequest(`/admin/landing-page/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteEvent: (id: string) =>
    apiRequest(`/admin/landing-page/events/${id}`, { method: "DELETE" }),
  getRegistrations: (eventId?: string) =>
    apiRequest(
      eventId
        ? `/admin/landing-page/events/${eventId}/registrations`
        : "/admin/landing-page/event-registrations"
    ),
  updateRegistration: (id: string, data: Partial<EventRegistration>) =>
    apiRequest(`/admin/landing-page/event-registrations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Services API
export const servicesApi = {
  getSettings: () => apiRequest("/admin/landing-page/services/settings"),
  updateSettings: (data: Partial<ServicesPageSettings>) =>
    apiRequest("/admin/landing-page/services/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getServices: () => apiRequest("/admin/landing-page/services"),
  getService: (id: string) => apiRequest(`/admin/landing-page/services/${id}`),
  createService: (data: Service) =>
    apiRequest("/admin/landing-page/services", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateService: (id: string, data: Partial<Service>) =>
    apiRequest(`/admin/landing-page/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteService: (id: string) =>
    apiRequest(`/admin/landing-page/services/${id}`, { method: "DELETE" }),
  getRequests: () => apiRequest("/admin/landing-page/service-requests"),
  updateRequest: (id: string, data: Partial<ServiceRequest>) =>
    apiRequest(`/admin/landing-page/service-requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Pricing API
export const pricingApi = {
  getSettings: () => apiRequest("/admin/landing-page/pricing/settings"),
  updateSettings: (data: Partial<PricingPageSettings>) =>
    apiRequest("/admin/landing-page/pricing/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getPlans: () => apiRequest("/admin/landing-page/pricing/plans"),
  getPlan: (id: string) =>
    apiRequest(`/admin/landing-page/pricing/plans/${id}`),
  createPlan: (data: PricingPlan) =>
    apiRequest("/admin/landing-page/pricing/plans", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePlan: (id: string, data: Partial<PricingPlan>) =>
    apiRequest(`/admin/landing-page/pricing/plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePlan: (id: string) =>
    apiRequest(`/admin/landing-page/pricing/plans/${id}`, { method: "DELETE" }),
  getPlanFeatures: (planId: string) =>
    apiRequest(`/admin/landing-page/pricing/plans/${planId}/features`),
  createPlanFeature: (data: PricingPlanFeature) =>
    apiRequest("/admin/landing-page/pricing/plan-features", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePlanFeature: (id: string, data: Partial<PricingPlanFeature>) =>
    apiRequest(`/admin/landing-page/pricing/plan-features/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePlanFeature: (id: string) =>
    apiRequest(`/admin/landing-page/pricing/plan-features/${id}`, {
      method: "DELETE",
    }),
  getSubscriptions: () =>
    apiRequest("/admin/landing-page/pricing/subscriptions"),
  updateSubscription: (id: string, data: Partial<UserSubscription>) =>
    apiRequest(`/admin/landing-page/pricing/subscriptions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Guidelines API
export const guidelinesApi = {
  getSettings: () => apiRequest("/admin/landing-page/guidelines/settings"),
  updateSettings: (data: Partial<GuidelinesPageSettings>) =>
    apiRequest("/admin/landing-page/guidelines/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getGuidelines: () => apiRequest("/admin/landing-page/guidelines"),
  getGuideline: (id: string) =>
    apiRequest(`/admin/landing-page/guidelines/${id}`),
  createGuideline: (data: Guideline) =>
    apiRequest("/admin/landing-page/guidelines", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateGuideline: (id: string, data: Partial<Guideline>) =>
    apiRequest(`/admin/landing-page/guidelines/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteGuideline: (id: string) =>
    apiRequest(`/admin/landing-page/guidelines/${id}`, { method: "DELETE" }),
};

// Hero API
export const heroApi = {
  getSettings: () => apiRequest("/admin/landing-page/hero/settings"),
  updateSettings: (data: Partial<HeroPageSettings>) =>
    apiRequest("/admin/landing-page/hero/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getSlides: () => apiRequest("/admin/landing-page/hero/slides"),
  getSlide: (id: string) => apiRequest(`/admin/landing-page/hero/slides/${id}`),
  createSlide: (data: HeroSlide) =>
    apiRequest("/admin/landing-page/hero/slides", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSlide: (id: string, data: Partial<HeroSlide>) =>
    apiRequest(`/admin/landing-page/hero/slides/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteSlide: (id: string) =>
    apiRequest(`/admin/landing-page/hero/slides/${id}`, { method: "DELETE" }),
};

// Footer API
export const footerApi = {
  getSettings: () => apiRequest("/admin/landing-page/footer/settings"),
  updateSettings: (data: Partial<FooterSettings>) =>
    apiRequest("/admin/landing-page/footer/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getLinks: () => apiRequest("/admin/landing-page/footer/links"),
  createLink: (data: FooterLink) =>
    apiRequest("/admin/landing-page/footer/links", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateLink: (id: string, data: Partial<FooterLink>) =>
    apiRequest(`/admin/landing-page/footer/links/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteLink: (id: string) =>
    apiRequest(`/admin/landing-page/footer/links/${id}`, { method: "DELETE" }),
};
