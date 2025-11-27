import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Calendar,
  Settings,
  DollarSign,
  BookOpen,
  Image,
  Link as LinkIcon,
  Eye,
  Edit,
  Trash2,
  Plus,
  AlertCircle,
  Navigation,
} from "lucide-react";
import {
  navbarApi,
  contactApi,
  eventsApi,
  servicesApi,
  pricingApi,
  guidelinesApi,
  heroApi,
  footerApi,
  type NavbarMenuItem,
  type NavbarSettings,
  type ContactPageSettings,
  type ContactMessage,
  type ContactInformation,
  type EventsPageSettings,
  type Event,
  type EventRegistration,
  type ServicesPageSettings,
  type Service,
  type ServiceRequest,
  type PricingPageSettings,
  type PricingPlan,
  type PricingPlanFeature,
  type GuidelinesPageSettings,
  type Guideline,
  type HeroPageSettings,
  type HeroSlide,
  type FooterLink,
  type FooterSettings,
} from "../services/landingPageApi";

interface ControlPanelProps {
  onClose: () => void;
}

const PagesControlPanel: React.FC<ControlPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<string>("navbar");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Navbar state
  const [navbarMenuItems, setNavbarMenuItems] = useState<NavbarMenuItem[]>([]);
  const [navbarSettings, setNavbarSettings] = useState<NavbarSettings | null>(
    null
  );
  const [editingNavbarItem, setEditingNavbarItem] =
    useState<NavbarMenuItem | null>(null);

  // Contact state
  const [contactSettings, setContactSettings] =
    useState<ContactPageSettings | null>(null);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [contactInformation, setContactInformation] = useState<
    ContactInformation[]
  >([]);
  const [editingContactInfo, setEditingContactInfo] =
    useState<ContactInformation | null>(null);

  // Events state
  const [eventsSettings, setEventsSettings] =
    useState<EventsPageSettings | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<
    EventRegistration[]
  >([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Services state
  const [servicesSettings, setServicesSettings] =
    useState<ServicesPageSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Pricing state
  const [pricingSettings, setPricingSettings] =
    useState<PricingPageSettings | null>(null);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [planFeatures, setPlanFeatures] = useState<
    Record<string, PricingPlanFeature[]>
  >({});
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

  // Guidelines state
  const [guidelinesSettings, setGuidelinesSettings] =
    useState<GuidelinesPageSettings | null>(null);
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [editingGuideline, setEditingGuideline] = useState<Guideline | null>(
    null
  );

  // Hero state
  const [heroSettings, setHeroSettings] = useState<HeroPageSettings | null>(
    null
  );
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Footer state
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(
    null
  );
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [editingFooterLink, setEditingFooterLink] = useState<FooterLink | null>(
    null
  );

  // Helper function to extract error message from any error type
  const getErrorMessage = (err: unknown, defaultMessage: string): string => {
    if (err instanceof Error) {
      return err.message || defaultMessage;
    }
    if (typeof err === "string") {
      return err;
    }
    if (typeof err === "boolean") {
      return defaultMessage;
    }
    if (err && typeof err === "object") {
      const errorObj = err as { message?: unknown; error?: unknown };
      if (errorObj.message && typeof errorObj.message === "string") {
        return errorObj.message;
      }
      if (errorObj.error && typeof errorObj.error === "string") {
        return errorObj.error;
      }
    }
    return defaultMessage;
  };

  const tabs = [
    { id: "navbar", label: "Navbar", icon: Navigation },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "events", label: "Events", icon: Calendar },
    { id: "services", label: "Services", icon: Settings },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "guidelines", label: "Guidelines", icon: BookOpen },
    { id: "hero", label: "Hero", icon: Image },
    { id: "footer", label: "Footer", icon: LinkIcon },
  ];

  // Load data when tab changes
  useEffect(() => {
    loadTabData(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadTabData = async (tab: string) => {
    setLoading(true);
    setError(null);
    try {
      switch (tab) {
        case "navbar":
          await loadNavbarData();
          break;
        case "contact":
          await loadContactData();
          break;
        case "events":
          await loadEventsData();
          break;
        case "services":
          await loadServicesData();
          break;
        case "pricing":
          await loadPricingData();
          break;
        case "guidelines":
          await loadGuidelinesData();
          break;
        case "hero":
          await loadHeroData();
          break;
        case "footer":
          await loadFooterData();
          break;
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Failed to load data");
      setError(errorMessage);
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadNavbarData = async () => {
    try {
      const [menuItemsResponse, settingsResponse] = await Promise.all([
        navbarApi.getMenuItems(),
        navbarApi.getSettings(),
      ]);
      setNavbarMenuItems(menuItemsResponse.data || menuItemsResponse || []);
      setNavbarSettings(settingsResponse.data || settingsResponse || null);
    } catch (err) {
      console.error("Load navbar data error:", err);
      // If API doesn't exist yet, use empty data
      setNavbarMenuItems([]);
      setNavbarSettings(null);
    }
  };

  const loadContactData = async () => {
    try {
      const [settingsResponse, messagesResponse, informationResponse] = await Promise.all([
        contactApi.getSettings(),
        contactApi.getMessages(),
        contactApi.getInformation(),
      ]);
      setContactSettings(settingsResponse.data || settingsResponse || null);
      setContactMessages(messagesResponse.data || messagesResponse || []);
      setContactInformation(informationResponse.data || informationResponse || []);
    } catch (err) {
      console.error("Load contact data error:", err);
      setContactSettings(null);
      setContactMessages([]);
      setContactInformation([]);
    }
  };

  const loadEventsData = async () => {
    try {
      const [settingsResponse, eventsResponse, registrationsResponse] = await Promise.all([
        eventsApi.getSettings(),
        eventsApi.getEvents(),
        eventsApi.getRegistrations(),
      ]);
      setEventsSettings(settingsResponse.data || settingsResponse || null);
      setEvents(eventsResponse.data || eventsResponse || []);
      setEventRegistrations(registrationsResponse.data || registrationsResponse || []);
    } catch (err) {
      console.error("Load events data error:", err);
      setEventsSettings(null);
      setEvents([]);
      setEventRegistrations([]);
    }
  };

  const loadServicesData = async () => {
    try {
      const [settingsResponse, servicesResponse, requestsResponse] = await Promise.all([
        servicesApi.getSettings(),
        servicesApi.getServices(),
        servicesApi.getRequests(),
      ]);
      setServicesSettings(settingsResponse.data || settingsResponse || null);
      setServices(servicesResponse.data || servicesResponse || []);
      setServiceRequests(requestsResponse.data || requestsResponse || []);
    } catch (err) {
      console.error("Load services data error:", err);
      setServicesSettings(null);
      setServices([]);
      setServiceRequests([]);
    }
  };

  const loadPricingData = async () => {
    try {
      const [settingsResponse, plansResponse] = await Promise.all([
        pricingApi.getSettings(),
        pricingApi.getPlans(),
      ]);
      setPricingSettings(settingsResponse.data || settingsResponse || null);
      const plans = plansResponse.data || plansResponse || [];
      setPricingPlans(plans);

      // Load features for each plan
      const featuresMap: Record<string, PricingPlanFeature[]> = {};
      for (const plan of plans) {
        if (plan.id) {
          try {
            const featuresResponse = await pricingApi.getPlanFeatures(plan.id);
            featuresMap[plan.id] = featuresResponse.data || featuresResponse || [];
          } catch (err) {
            console.error(`Load features for plan ${plan.id} error:`, err);
            featuresMap[plan.id] = [];
          }
        }
      }
      setPlanFeatures(featuresMap);
    } catch (err) {
      console.error("Load pricing data error:", err);
      setPricingSettings(null);
      setPricingPlans([]);
      setPlanFeatures({});
    }
  };

  const loadGuidelinesData = async () => {
    try {
      const [settingsResponse, guidelinesResponse] = await Promise.all([
        guidelinesApi.getSettings(),
        guidelinesApi.getGuidelines(),
      ]);
      setGuidelinesSettings(settingsResponse.data || settingsResponse || null);
      setGuidelines(guidelinesResponse.data || guidelinesResponse || []);
    } catch (err) {
      console.error("Load guidelines data error:", err);
      setGuidelinesSettings(null);
      setGuidelines([]);
    }
  };

  const loadHeroData = async () => {
    try {
      const [settingsResponse, slidesResponse] = await Promise.all([
        heroApi.getSettings(),
        heroApi.getSlides(),
      ]);
      setHeroSettings(settingsResponse.data || settingsResponse || null);
      setHeroSlides(slidesResponse.data || slidesResponse || []);
    } catch (err) {
      console.error("Load hero data error:", err);
      setHeroSettings(null);
      setHeroSlides([]);
    }
  };

  const loadFooterData = async () => {
    try {
      const [settingsResponse, linksResponse] = await Promise.all([
        footerApi.getSettings(),
        footerApi.getLinks(),
      ]);
      setFooterSettings(settingsResponse.data || settingsResponse || null);
      setFooterLinks(linksResponse.data || linksResponse || []);
    } catch (err) {
      console.error("Load footer data error:", err);
      setFooterSettings(null);
      setFooterLinks([]);
    }
  };

  // Render functions for each tab
  const renderNavbarTab = () => (
    <div className="control-panel__content">
      <div className="control-panel__section">
        <div className="control-panel__header">
          <h3 className="control-panel__section-title">Navbar Menu Items</h3>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() =>
              setEditingNavbarItem({
                label: "",
                link_type: "scroll",
                display_order: 0,
                is_active: true,
                requires_auth: false,
              })
            }
          >
            <Plus size={16} />
            Add Menu Item
          </button>
        </div>
        <div className="control-panel__table-wrapper">
          <table className="control-panel__table">
            <thead>
              <tr>
                <th>Label</th>
                <th>Type</th>
                <th>Target</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {navbarMenuItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="control-panel__empty">
                    No menu items yet
                  </td>
                </tr>
              ) : (
                navbarMenuItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.label}</td>
                    <td>{item.link_type}</td>
                    <td>{item.link_target || item.scroll_target_id || "-"}</td>
                    <td>{item.display_order}</td>
                    <td>
                      <span
                        className={`control-panel__badge ${
                          item.is_active
                            ? "control-panel__badge--active"
                            : "control-panel__badge--inactive"
                        }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="control-panel__card-actions">
                        <button
                          className="control-panel__icon-button"
                          onClick={() => setEditingNavbarItem(item)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="control-panel__icon-button"
                          onClick={() => handleDeleteNavbarItem(item.id!)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="control-panel__section">
        <h3 className="control-panel__section-title">Navbar Settings</h3>
        {navbarSettings && (
          <div style={{ marginTop: "16px" }}>
            <p>
              <strong>Logo URL:</strong> {navbarSettings.logo_url || "Not set"}
            </p>
            <p>
              <strong>Get Started Button:</strong>{" "}
              {navbarSettings.get_started_button_text || "Not set"}
            </p>
            <button
              className="control-panel__button control-panel__button--secondary"
              style={{ marginTop: "12px" }}
            >
              <Edit size={16} />
              Edit Settings
            </button>
          </div>
        )}
      </div>
      {editingNavbarItem && (
        <NavbarItemModal
          item={editingNavbarItem}
          onClose={() => setEditingNavbarItem(null)}
          onSave={handleSaveNavbarItem}
        />
      )}
    </div>
  );

  const renderContactTab = () => (
    <div className="control-panel__content">
      {editingContactInfo && (
        <ContactInfoModal
          info={editingContactInfo}
          onClose={() => setEditingContactInfo(null)}
          onSave={handleSaveContactInfo}
        />
      )}
      <div className="control-panel__section">
        <h3 className="control-panel__section-title">Contact Page Settings</h3>
        {contactSettings ? (
          <div style={{ marginTop: "16px" }}>
            <p>
              <strong>Badge Text:</strong> {contactSettings.badge_text || "Not set"}
            </p>
            <p>
              <strong>Heading:</strong> {contactSettings.heading || "Not set"}
            </p>
            <p>
              <strong>Subheading:</strong> {contactSettings.subheading || "Not set"}
            </p>
            <button
              className="control-panel__button control-panel__button--secondary"
              style={{ marginTop: "12px" }}
            >
              <Edit size={16} />
              Edit Settings
            </button>
          </div>
        ) : (
          <p style={{ marginTop: "16px", color: "#666" }}>No settings configured</p>
        )}
      </div>
      <div className="control-panel__section">
        <h3 className="control-panel__section-title">Contact Messages</h3>
        <div className="control-panel__table-wrapper">
          <table className="control-panel__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contactMessages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="control-panel__empty">
                    No messages yet
                  </td>
                </tr>
              ) : (
                contactMessages.map((msg) => (
                  <tr key={msg.id}>
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.subject || "-"}</td>
                    <td>
                      <span
                        className={`control-panel__badge control-panel__badge--${
                          msg.status || "pending"
                        }`}
                      >
                        {msg.status || "pending"}
                      </span>
                    </td>
                    <td>{msg.id ? "Recent" : "-"}</td>
                    <td>
                      <div className="control-panel__card-actions">
                        <button className="control-panel__icon-button">
                          <Eye size={16} />
                        </button>
                        <button
                          className="control-panel__icon-button"
                          onClick={() => handleDeleteContactMessage(msg.id!)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="control-panel__section">
        <div className="control-panel__header">
          <h3 className="control-panel__section-title">Contact Information</h3>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() =>
              setEditingContactInfo({
                contact_type: "phone",
                title: "",
                primary_value: "",
                is_active: true,
                display_order: 0,
              })
            }
          >
            <Plus size={16} />
            Add Contact Info
          </button>
        </div>
        <div className="control-panel__grid">
          {contactInformation.length === 0 ? (
            <div className="control-panel__empty">No contact information yet</div>
          ) : (
            contactInformation.map((info) => (
            <div key={info.id} className="control-panel__card">
              <div className="control-panel__card-header">
                <h4>{info.title}</h4>
                <div className="control-panel__card-actions">
                  <button
                    className="control-panel__icon-button"
                    onClick={() => setEditingContactInfo(info)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="control-panel__icon-button"
                    onClick={() => handleDeleteContactInfo(info.id!)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="control-panel__card-description">
                {info.primary_value}
              </p>
              <span
                className={`control-panel__badge ${
                  info.is_active
                    ? "control-panel__badge--active"
                    : "control-panel__badge--inactive"
                }`}
              >
                {info.contact_type}
              </span>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderEventsTab = () => (
    <div className="control-panel__content">
      {editingEvent && (
        <EventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleSaveEvent}
        />
      )}
      <div className="control-panel__section">
        <h3 className="control-panel__section-title">Events Page Settings</h3>
        {eventsSettings ? (
          <div style={{ marginTop: "16px" }}>
            <p>
              <strong>Badge Text:</strong> {eventsSettings.badge_text || "Not set"}
            </p>
            <p>
              <strong>Heading:</strong> {eventsSettings.heading || "Not set"}
            </p>
            <p>
              <strong>Subheading:</strong> {eventsSettings.subheading || "Not set"}
            </p>
            <p>
              <strong>Default Image URL:</strong> {eventsSettings.default_image_url || "Not set"}
            </p>
            <button
              className="control-panel__button control-panel__button--secondary"
              style={{ marginTop: "12px" }}
            >
              <Edit size={16} />
              Edit Settings
            </button>
          </div>
        ) : (
          <p style={{ marginTop: "16px", color: "#666" }}>No settings configured</p>
        )}
      </div>
      {eventRegistrations.length > 0 && (
        <div className="control-panel__section">
          <h3 className="control-panel__section-title">Event Registrations ({eventRegistrations.length})</h3>
          <div className="control-panel__table-wrapper">
            <table className="control-panel__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Event ID</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {eventRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>{reg.name}</td>
                    <td>{reg.email}</td>
                    <td>{reg.event_id}</td>
                    <td>
                      <span
                        className={`control-panel__badge control-panel__badge--${
                          reg.status || "pending"
                        }`}
                      >
                        {reg.status || "pending"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`control-panel__badge control-panel__badge--${
                          reg.payment_status || "pending"
                        }`}
                      >
                        {reg.payment_status || "pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="control-panel__section">
        <div className="control-panel__header">
          <h3 className="control-panel__section-title">Events</h3>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() =>
              setEditingEvent({
                title: "",
                event_date: new Date().toISOString().split("T")[0],
                status: "upcoming",
              })
            }
          >
            <Plus size={16} />
            Add Event
          </button>
        </div>
        <div className="control-panel__table-wrapper">
          <table className="control-panel__table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Attendees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="control-panel__empty">
                    No events yet
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.event_date}</td>
                    <td>{event.location || "-"}</td>
                    <td>
                      <span
                        className={`control-panel__badge control-panel__badge--${
                          event.status || "upcoming"
                        }`}
                      >
                        {event.status || "upcoming"}
                      </span>
                    </td>
                    <td>
                      {event.current_attendees || 0} /{" "}
                      {event.max_attendees || "∞"}
                    </td>
                    <td>
                      <div className="control-panel__card-actions">
                        <button
                          className="control-panel__icon-button"
                          onClick={() => setEditingEvent(event)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="control-panel__icon-button"
                          onClick={() => handleDeleteEvent(event.id!)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderServicesTab = () => (
    <div className="control-panel__content">
      {editingService && (
        <ServiceModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSave={handleSaveService}
        />
      )}
      <div className="control-panel__section">
        <h3 className="control-panel__section-title">Services Page Settings</h3>
        {servicesSettings ? (
          <div style={{ marginTop: "16px" }}>
            <p>
              <strong>Badge Text:</strong> {servicesSettings.badge_text || "Not set"}
            </p>
            <p>
              <strong>Heading:</strong> {servicesSettings.heading || "Not set"}
            </p>
            <p>
              <strong>Subheading:</strong> {servicesSettings.subheading || "Not set"}
            </p>
            <p>
              <strong>View All Button Text:</strong> {servicesSettings.view_all_button_text || "Not set"}
            </p>
            <button
              className="control-panel__button control-panel__button--secondary"
              style={{ marginTop: "12px" }}
            >
              <Edit size={16} />
              Edit Settings
            </button>
          </div>
        ) : (
          <p style={{ marginTop: "16px", color: "#666" }}>No settings configured</p>
        )}
      </div>
      {serviceRequests.length > 0 && (
        <div className="control-panel__section">
          <h3 className="control-panel__section-title">Service Requests ({serviceRequests.length})</h3>
          <div className="control-panel__table-wrapper">
            <table className="control-panel__table">
              <thead>
                <tr>
                  <th>Service ID</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.service_id}</td>
                    <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {req.description}
                    </td>
                    <td>
                      <span
                        className={`control-panel__badge control-panel__badge--${
                          req.status || "pending"
                        }`}
                      >
                        {req.status || "pending"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`control-panel__badge control-panel__badge--${
                          req.priority || "medium"
                        }`}
                      >
                        {req.priority || "medium"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="control-panel__section">
        <div className="control-panel__header">
          <h3 className="control-panel__section-title">Services</h3>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() =>
              setEditingService({
                service_key: "",
                title: "",
                description: "",
                icon_color: "#1a5d3a",
                is_active: true,
                display_order: 0,
              })
            }
          >
            <Plus size={16} />
            Add Service
          </button>
        </div>
        <div className="control-panel__grid">
          {services.length === 0 ? (
            <div className="control-panel__empty" style={{ gridColumn: "1 / -1" }}>No services yet</div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="control-panel__card">
                <div className="control-panel__card-header">
                  <h4>{service.title}</h4>
                  <div className="control-panel__card-actions">
                    <button
                      className="control-panel__icon-button"
                      onClick={() => setEditingService(service)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="control-panel__icon-button"
                      onClick={() => handleDeleteService(service.id!)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="control-panel__card-description">
                  {service.description}
                </p>
                <span
                  className={`control-panel__badge ${
                    service.is_active
                      ? "control-panel__badge--active"
                      : "control-panel__badge--inactive"
                  }`}
                >
                  {service.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderPricingTab = () => (
    <div className="control-panel__content">
      {editingPlan && (
        <PricingPlanModal
          plan={editingPlan}
          onClose={() => setEditingPlan(null)}
          onSave={handleSavePlan}
        />
      )}
      <div className="control-panel__section">
        <h3 className="control-panel__section-title">Pricing Page Settings</h3>
        {pricingSettings ? (
          <div style={{ marginTop: "16px" }}>
            <p>
              <strong>Badge Text:</strong> {pricingSettings.badge_text || "Not set"}
            </p>
            <p>
              <strong>Heading:</strong> {pricingSettings.heading || "Not set"}
            </p>
            <p>
              <strong>Subheading:</strong> {pricingSettings.subheading || "Not set"}
            </p>
            <p>
              <strong>Subscribe Button Text:</strong> {pricingSettings.subscribe_button_text || "Not set"}
            </p>
            <button
              className="control-panel__button control-panel__button--secondary"
              style={{ marginTop: "12px" }}
            >
              <Edit size={16} />
              Edit Settings
            </button>
          </div>
        ) : (
          <p style={{ marginTop: "16px", color: "#666" }}>No settings configured</p>
        )}
      </div>
      <div className="control-panel__section">
        <div className="control-panel__header">
          <h3 className="control-panel__section-title">Pricing Plans</h3>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() =>
              setEditingPlan({
                plan_key: "",
                name: "",
                price: 0,
                currency: "NGN",
                billing_period: "monthly",
                is_active: true,
                display_order: 0,
              })
            }
          >
            <Plus size={16} />
            Add Plan
          </button>
        </div>
        <div className="control-panel__grid">
          {pricingPlans.length === 0 ? (
            <div className="control-panel__empty" style={{ gridColumn: "1 / -1" }}>No pricing plans yet</div>
          ) : (
            pricingPlans.map((plan) => (
              <div key={plan.id} className="control-panel__card">
                <div className="control-panel__card-header">
                  <h4>{plan.name}</h4>
                  <div className="control-panel__card-actions">
                    <button
                      className="control-panel__icon-button"
                      onClick={() => setEditingPlan(plan)}
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
                <p className="control-panel__card-price">
                  ₦{plan.price.toLocaleString()}
                </p>
                <p className="control-panel__card-description">
                  {plan.description || "No description"}
                </p>
                <button
                  className="control-panel__button control-panel__button--secondary"
                  style={{ marginTop: "8px" }}
                >
                  Manage Features ({planFeatures[plan.id || ""]?.length || 0})
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderGuidelinesTab = () => (
    <div className="control-panel__content">
      {editingGuideline && (
        <GuidelineModal
          guideline={editingGuideline}
          onClose={() => setEditingGuideline(null)}
          onSave={handleSaveGuideline}
        />
      )}
      <div className="control-panel__section">
        <h3 className="control-panel__section-title">Guidelines Page Settings</h3>
        {guidelinesSettings ? (
          <div style={{ marginTop: "16px" }}>
            <p>
              <strong>Badge Text:</strong> {guidelinesSettings.badge_text || "Not set"}
            </p>
            <p>
              <strong>Heading:</strong> {guidelinesSettings.heading || "Not set"}
            </p>
            <button
              className="control-panel__button control-panel__button--secondary"
              style={{ marginTop: "12px" }}
            >
              <Edit size={16} />
              Edit Settings
            </button>
          </div>
        ) : (
          <p style={{ marginTop: "16px", color: "#666" }}>No settings configured</p>
        )}
      </div>
      <div className="control-panel__section">
        <div className="control-panel__header">
          <h3 className="control-panel__section-title">Guidelines</h3>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() =>
              setEditingGuideline({
                quote: "",
                author_name: "",
                rating: 5,
                display_order: 0,
                is_active: true,
              })
            }
          >
            <Plus size={16} />
            Add Guideline
          </button>
        </div>
        <div className="control-panel__table-wrapper">
          <table className="control-panel__table">
            <thead>
              <tr>
                <th>Quote</th>
                <th>Author</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guidelines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="control-panel__empty">
                    No guidelines yet
                  </td>
                </tr>
              ) : (
                guidelines.map((guideline) => (
                  <tr key={guideline.id}>
                    <td
                      style={{
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {guideline.quote}
                    </td>
                    <td>{guideline.author_name}</td>
                    <td>{guideline.rating || 5} ⭐</td>
                    <td>
                      <span
                        className={`control-panel__badge ${
                          guideline.is_active
                            ? "control-panel__badge--active"
                            : "control-panel__badge--inactive"
                        }`}
                      >
                        {guideline.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="control-panel__card-actions">
                        <button
                          className="control-panel__icon-button"
                          onClick={() => setEditingGuideline(guideline)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="control-panel__icon-button"
                          onClick={() => handleDeleteGuideline(guideline.id!)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderHeroTab = () => (
    <div className="control-panel__content">
      {editingSlide && (
        <HeroSlideModal
          slide={editingSlide}
          onClose={() => setEditingSlide(null)}
          onSave={handleSaveSlide}
        />
      )}
      <div className="control-panel__section">
        <h3 className="control-panel__section-title">Hero Page Settings</h3>
        {heroSettings ? (
          <div style={{ marginTop: "16px" }}>
            <p>
              <strong>Slide Duration (seconds):</strong> {heroSettings.slide_duration_seconds || "Not set"}
            </p>
            <p>
              <strong>Auto Advance:</strong> {heroSettings.auto_advance ? "Yes" : "No"}
            </p>
            <p>
              <strong>Show Navigation Dots:</strong> {heroSettings.show_navigation_dots ? "Yes" : "No"}
            </p>
            <p>
              <strong>Show Prev/Next Arrows:</strong> {heroSettings.show_prev_next_arrows ? "Yes" : "No"}
            </p>
            <p>
              <strong>Default Badge Text:</strong> {heroSettings.default_badge_text || "Not set"}
            </p>
            <p>
              <strong>Primary Button Text:</strong> {heroSettings.primary_button_text || "Not set"}
            </p>
            <p>
              <strong>Primary Button Route:</strong> {heroSettings.primary_button_route || "Not set"}
            </p>
            <p>
              <strong>Secondary Button Text:</strong> {heroSettings.secondary_button_text || "Not set"}
            </p>
            <p>
              <strong>Secondary Button Route:</strong> {heroSettings.secondary_button_route || "Not set"}
            </p>
            <button
              className="control-panel__button control-panel__button--secondary"
              style={{ marginTop: "12px" }}
            >
              <Edit size={16} />
              Edit Settings
            </button>
          </div>
        ) : (
          <p style={{ marginTop: "16px", color: "#666" }}>No settings configured</p>
        )}
      </div>
      <div className="control-panel__section">
        <div className="control-panel__header">
          <h3 className="control-panel__section-title">Hero Slides</h3>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() =>
              setEditingSlide({
                title: "",
                image_url: "",
                slide_order: 0,
                is_active: true,
              })
            }
          >
            <Plus size={16} />
            Add Slide
          </button>
        </div>
        <div className="control-panel__grid">
          {heroSlides.length === 0 ? (
            <div className="control-panel__empty" style={{ gridColumn: "1 / -1" }}>No slides yet</div>
          ) : (
            heroSlides.map((slide) => (
              <div key={slide.id} className="control-panel__card">
                <div className="control-panel__card-image">
                  {slide.image_url ? (
                    <img
                      src={slide.image_url}
                      alt={slide.image_alt || slide.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <Image size={48} />
                  )}
                </div>
                <div className="control-panel__card-header">
                  <h4>{slide.title || "Untitled Slide"}</h4>
                  <div className="control-panel__card-actions">
                    <button
                      className="control-panel__icon-button"
                      onClick={() => setEditingSlide(slide)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="control-panel__icon-button"
                      onClick={() => handleDeleteSlide(slide.id!)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <span
                  className={`control-panel__badge ${
                    slide.is_active
                      ? "control-panel__badge--active"
                      : "control-panel__badge--inactive"
                  }`}
                >
                  {slide.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderFooterTab = () => (
    <div className="control-panel__content">
      {editingFooterLink && (
        <FooterLinkModal
          link={editingFooterLink}
          onClose={() => setEditingFooterLink(null)}
          onSave={handleSaveFooterLink}
        />
      )}
      <div className="control-panel__section">
        <h3 className="control-panel__section-title">Footer Settings</h3>
        {footerSettings ? (
          <div style={{ marginTop: "16px" }}>
            <p>
              <strong>Logo URL:</strong> {footerSettings.logo_url || "Not set"}
            </p>
            <p>
              <strong>Tagline:</strong> {footerSettings.tagline || "Not set"}
            </p>
            <p>
              <strong>Copyright Text:</strong> {footerSettings.copyright_text || "Not set"}
            </p>
            {footerSettings.social_media && Object.keys(footerSettings.social_media).length > 0 && (
              <div style={{ marginTop: "12px" }}>
                <strong>Social Media:</strong>
                <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                  {Object.entries(footerSettings.social_media).map(([platform, url]) => (
                    <li key={platform}>
                      {platform}: {url}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="control-panel__button control-panel__button--secondary"
              style={{ marginTop: "12px" }}
            >
              <Edit size={16} />
              Edit Settings
            </button>
          </div>
        ) : (
          <p style={{ marginTop: "16px", color: "#666" }}>No settings configured</p>
        )}
      </div>
      <div className="control-panel__section">
        <div className="control-panel__header">
          <h3 className="control-panel__section-title">Footer Links</h3>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() =>
              setEditingFooterLink({
                link_text: "",
                link_url: "",
                section: "quick_links",
                display_order: 0,
                is_active: true,
              })
            }
          >
            <Plus size={16} />
            Add Link
          </button>
        </div>
        <div className="control-panel__table-wrapper">
          <table className="control-panel__table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Link Text</th>
                <th>URL</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {footerLinks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="control-panel__empty">
                    No links yet
                  </td>
                </tr>
              ) : (
                footerLinks.map((link) => (
                  <tr key={link.id}>
                    <td>{link.section}</td>
                    <td>{link.link_text}</td>
                    <td>{link.link_url}</td>
                    <td>
                      <span
                        className={`control-panel__badge ${
                          link.is_active
                            ? "control-panel__badge--active"
                            : "control-panel__badge--inactive"
                        }`}
                      >
                        {link.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="control-panel__card-actions">
                        <button
                          className="control-panel__icon-button"
                          onClick={() => setEditingFooterLink(link)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="control-panel__icon-button"
                          onClick={() => handleDeleteFooterLink(link.id!)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (loading) {
      return <div className="control-panel__empty">Loading...</div>;
    }

    if (error) {
      return (
        <div className="control-panel__empty" style={{ color: "#dc2626" }}>
          <AlertCircle size={20} style={{ marginBottom: "8px" }} />
          {error}
        </div>
      );
    }

    switch (activeTab) {
      case "navbar":
        return renderNavbarTab();
      case "contact":
        return renderContactTab();
      case "events":
        return renderEventsTab();
      case "services":
        return renderServicesTab();
      case "pricing":
        return renderPricingTab();
      case "guidelines":
        return renderGuidelinesTab();
      case "hero":
        return renderHeroTab();
      case "footer":
        return renderFooterTab();
      default:
        return <div>Select a tab</div>;
    }
  };

  // Handler functions
  const handleDeleteNavbarItem = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await navbarApi.deleteMenuItem(id);
        await loadNavbarData();
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Failed to delete menu item");
        alert(errorMessage);
      }
    }
  };

  const handleSaveNavbarItem = async (item: NavbarMenuItem) => {
    try {
      if (!item.label || !item.link_type) {
        alert("Please fill in all required fields (Label and Link Type)");
        return;
      }

      if (item.id) {
        await navbarApi.updateMenuItem(item.id, item);
      } else {
        await navbarApi.createMenuItem(item);
      }
      setEditingNavbarItem(null);
      await loadNavbarData();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Failed to save menu item");
      console.error("Save navbar item error:", err);
      alert(errorMessage);
    }
  };

  const handleDeleteContactMessage = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await contactApi.deleteMessage(id);
        await loadContactData();
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Failed to delete message");
        alert(errorMessage);
      }
    }
  };

  const handleDeleteContactInfo = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this contact information?"
      )
    ) {
      try {
        await contactApi.deleteInformation(id);
        await loadContactData();
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Failed to delete contact information");
        alert(errorMessage);
      }
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await eventsApi.deleteEvent(id);
        await loadEventsData();
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Failed to delete event");
        alert(errorMessage);
      }
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await servicesApi.deleteService(id);
        await loadServicesData();
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Failed to delete service");
        alert(errorMessage);
      }
    }
  };

  const handleDeleteGuideline = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this guideline?")) {
      try {
        await guidelinesApi.deleteGuideline(id);
        await loadGuidelinesData();
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Failed to delete guideline");
        alert(errorMessage);
      }
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      try {
        await heroApi.deleteSlide(id);
        await loadHeroData();
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Failed to delete slide");
        alert(errorMessage);
      }
    }
  };

  const handleDeleteFooterLink = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      try {
        await footerApi.deleteLink(id);
        await loadFooterData();
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Failed to delete link");
        alert(errorMessage);
      }
    }
  };

  const handleSaveContactInfo = async (info: ContactInformation) => {
    try {
      if (!info.title || !info.primary_value || !info.contact_type) {
        alert("Please fill in all required fields (Title, Primary Value, and Contact Type)");
        return;
      }

      if (info.id) {
        await contactApi.updateInformation(info.id, info);
      } else {
        await contactApi.createInformation(info);
      }
      setEditingContactInfo(null);
      await loadContactData();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Failed to save contact information");
      console.error("Save contact info error:", err);
      alert(errorMessage);
    }
  };

  const handleSaveEvent = async (event: Event) => {
    try {
      if (!event.title || !event.event_date) {
        alert("Please fill in all required fields (Title and Event Date)");
        return;
      }

      if (event.id) {
        await eventsApi.updateEvent(event.id, event);
      } else {
        await eventsApi.createEvent(event);
      }
      setEditingEvent(null);
      await loadEventsData();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Failed to save event");
      console.error("Save event error:", err);
      alert(errorMessage);
    }
  };

  const handleSaveService = async (service: Service) => {
    try {
      if (!service.service_key || !service.title || !service.description || !service.icon_color) {
        alert("Please fill in all required fields (Service Key, Title, Description, and Icon Color)");
        return;
      }

      if (service.id) {
        await servicesApi.updateService(service.id, service);
      } else {
        await servicesApi.createService(service);
      }
      setEditingService(null);
      await loadServicesData();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Failed to save service");
      console.error("Save service error:", err);
      alert(errorMessage);
    }
  };

  const handleSavePlan = async (plan: PricingPlan) => {
    try {
      if (!plan.plan_key || !plan.name || plan.price === undefined || plan.price === null) {
        alert("Please fill in all required fields (Plan Key, Name, and Price)");
        return;
      }

      if (plan.id) {
        await pricingApi.updatePlan(plan.id, plan);
      } else {
        await pricingApi.createPlan(plan);
      }
      setEditingPlan(null);
      await loadPricingData();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Failed to save pricing plan");
      console.error("Save pricing plan error:", err);
      alert(errorMessage);
    }
  };

  const handleSaveGuideline = async (guideline: Guideline) => {
    try {
      if (!guideline.quote || !guideline.author_name) {
        alert("Please fill in all required fields (Quote and Author Name)");
        return;
      }

      if (guideline.id) {
        await guidelinesApi.updateGuideline(guideline.id, guideline);
      } else {
        await guidelinesApi.createGuideline(guideline);
      }
      setEditingGuideline(null);
      await loadGuidelinesData();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Failed to save guideline");
      console.error("Save guideline error:", err);
      alert(errorMessage);
    }
  };

  const handleSaveSlide = async (slide: HeroSlide) => {
    try {
      if (!slide.title || !slide.image_url) {
        alert("Please fill in all required fields (Title and Image URL)");
        return;
      }

      if (slide.id) {
        await heroApi.updateSlide(slide.id, slide);
      } else {
        await heroApi.createSlide(slide);
      }
      setEditingSlide(null);
      await loadHeroData();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Failed to save slide");
      console.error("Save slide error:", err);
      alert(errorMessage);
    }
  };

  const handleSaveFooterLink = async (link: FooterLink) => {
    try {
      if (!link.link_text || !link.link_url || !link.section) {
        alert("Please fill in all required fields (Link Text, Link URL, and Section)");
        return;
      }

      if (link.id) {
        await footerApi.updateLink(link.id, link);
      } else {
        await footerApi.createLink(link);
      }
      setEditingFooterLink(null);
      await loadFooterData();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Failed to save footer link");
      console.error("Save footer link error:", err);
      alert(errorMessage);
    }
  };

  // Export current hardcoded elements to database
  const handleExportCurrentElements = async () => {
    if (
      !window.confirm(
        "This will save all current landing page elements to the database. Continue?"
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Helper function to create or update items
      const upsertMenuItem = async (item: NavbarMenuItem) => {
        try {
          // Try to get existing items to check for duplicates
          const existing = await navbarApi.getMenuItems();
          const existingItems = existing.data || existing || [];
          const existingItem = existingItems.find((i: NavbarMenuItem) => i.label === item.label);
          
          if (existingItem?.id) {
            await navbarApi.updateMenuItem(existingItem.id, item);
            console.log(`Updated navbar item: ${item.label}`);
          } else {
            await navbarApi.createMenuItem(item);
            console.log(`Created navbar item: ${item.label}`);
          }
        } catch (err) {
          console.error(`Error upserting navbar item ${item.label}:`, err);
          throw err;
        }
      };

      // 1. Export Navbar Menu Items
      const navbarMenuItems = [
        {
          label: "Home",
          link_type: "scroll" as const,
          scroll_target_id: "home",
          display_order: 1,
          is_active: true,
          requires_auth: false,
        },
        {
          label: "About",
          link_type: "scroll" as const,
          scroll_target_id: "about",
          display_order: 2,
          is_active: true,
          requires_auth: false,
        },
        {
          label: "Guidelines",
          link_type: "scroll" as const,
          scroll_target_id: "guidelines",
          display_order: 3,
          is_active: true,
          requires_auth: false,
        },
        {
          label: "Services",
          link_type: "scroll" as const,
          scroll_target_id: "services",
          display_order: 4,
          is_active: true,
          requires_auth: false,
        },
        {
          label: "Contact Us",
          link_type: "scroll" as const,
          scroll_target_id: "contact",
          display_order: 5,
          is_active: true,
          requires_auth: false,
        },
      ];

      for (const item of navbarMenuItems) {
        await upsertMenuItem(item);
      }

      // 2. Export Navbar Settings
      await navbarApi.updateSettings({
        logo_url: "/image/primary-logo.png",
        get_started_button_text: "Get Started",
        get_started_button_route: "/welcome",
        is_active: true,
      });
      console.log("Navbar settings exported");

      // Helper function to upsert service
      const upsertService = async (service: Service) => {
        try {
          const existing = await servicesApi.getServices();
          const existingServices = existing.data || existing || [];
          const existingService = existingServices.find((s: Service) => s.service_key === service.service_key);
          
          if (existingService?.id) {
            await servicesApi.updateService(existingService.id, service);
            console.log(`Updated service: ${service.service_key}`);
          } else {
            await servicesApi.createService(service);
            console.log(`Created service: ${service.service_key}`);
          }
        } catch (err) {
          console.error(`Error upserting service ${service.service_key}:`, err);
          throw err;
        }
      };

      // 3. Export Services
      const services = [
        {
          service_key: "electricity",
          title: "Electricity Services",
          description: "Pay bills, report outages, and track consumption online",
          icon_color: "#FFC107",
          is_active: true,
          display_order: 1,
        },
        {
          service_key: "water",
          title: "Water Services",
          description: "Manage water bills and service requests efficiently",
          icon_color: "#2196F3",
          is_active: true,
          display_order: 2,
        },
        {
          service_key: "transportation",
          title: "Transportation",
          description: "Access public transport schedules and smart ticketing",
          icon_color: "#00C950",
          is_active: true,
          display_order: 3,
        },
        {
          service_key: "egovernance",
          title: "E-Governance",
          description: "Digital government services and documentation",
          icon_color: "#9C27B0",
          is_active: true,
          display_order: 4,
        },
        {
          service_key: "permits",
          title: "Permits & Licenses",
          description: "Apply for permits, licenses, and certifications online",
          icon_color: "#FF9800",
          is_active: true,
          display_order: 5,
        },
        {
          service_key: "tax",
          title: "Tax & Revenue",
          description: "Pay taxes, fees, and levies securely online",
          icon_color: "#F44336",
          is_active: true,
          display_order: 6,
        },
        {
          service_key: "wifi",
          title: "Smart City WiFi",
          description: "Free public WiFi hotspots across the city",
          icon_color: "#9C27B0",
          is_active: true,
          display_order: 7,
        },
        {
          service_key: "traffic",
          title: "Traffic Management",
          description: "Real-time traffic updates and road safety info",
          icon_color: "#00BCD4",
          is_active: true,
          display_order: 8,
        },
        {
          service_key: "property",
          title: "Property Services",
          description: "Land registry, property tax, and building approvals",
          icon_color: "#E91E63",
          is_active: true,
          display_order: 9,
        },
        {
          service_key: "emergency",
          title: "Emergency Services",
          description: "Quick access to fire, police, and medical services",
          icon_color: "#F44336",
          is_active: true,
          display_order: 10,
        },
        {
          service_key: "citizen",
          title: "Citizen Engagement",
          description: "Participate in city planning and community forums",
          icon_color: "#03A9F4",
          is_active: true,
          display_order: 11,
        },
        {
          service_key: "payments",
          title: "Digital Payments",
          description: "Unified payment gateway for all city services",
          icon_color: "#00C950",
          is_active: true,
          display_order: 12,
        },
      ];

      for (const service of services) {
        await upsertService(service);
      }

      // 4. Export Services Settings
      await servicesApi.updateSettings({
        badge_text: "Our Services",
        heading: "Comprehensive City Services",
        subheading:
          "Everything you need to interact with city services, all digitized and accessible 24/7",
        view_all_button_text: "View All",
      });
      console.log("Services settings exported");

      // Helper function to upsert pricing plan
      const upsertPricingPlan = async (plan: PricingPlan) => {
        try {
          const existing = await pricingApi.getPlans();
          const existingPlans = existing.data || existing || [];
          const existingPlan = existingPlans.find((p: PricingPlan) => p.plan_key === plan.plan_key);
          
          let planId: string;
          if (existingPlan?.id) {
            await pricingApi.updatePlan(existingPlan.id, plan);
            planId = existingPlan.id;
            console.log(`Updated pricing plan: ${plan.plan_key}`);
          } else {
            const createdPlan = await pricingApi.createPlan(plan);
            planId = createdPlan.data?.id || existingPlan?.id || "";
            console.log(`Created pricing plan: ${plan.plan_key}`);
          }

          // Create/update features for each plan
          if (planId) {
            const features = [
              { feature_name: "10% Discount", is_included: true },
              { feature_name: "Premium Partners", is_included: plan.plan_key !== "bronze" },
              { feature_name: "Free Monthly Service", is_included: plan.plan_key === "platinum" || plan.plan_key === "gold" },
              { feature_name: "Unlimited brands/users", is_included: plan.plan_key === "platinum" },
              { feature_name: "VIP perks", is_included: plan.plan_key === "platinum" },
            ];

            // Get existing features
            const existingFeatures = await pricingApi.getPlanFeatures(planId);
            const existingFeaturesList = existingFeatures.data || existingFeatures || [];

            for (const feature of features) {
              try {
                const existingFeature = existingFeaturesList.find(
                  (f: PricingPlanFeature) => f.feature_name === feature.feature_name && f.plan_id === planId
                );
                
                if (existingFeature?.id) {
                  await pricingApi.updatePlanFeature(existingFeature.id, {
                    is_included: feature.is_included,
                    display_order: features.indexOf(feature),
                  });
                } else {
                  await pricingApi.createPlanFeature({
                    plan_id: planId,
                    feature_name: feature.feature_name,
                    is_included: feature.is_included,
                    display_order: features.indexOf(feature),
                  });
                }
              } catch (err) {
                console.error(`Error upserting feature ${feature.feature_name}:`, err);
              }
            }
          }
        } catch (err) {
          console.error(`Error upserting pricing plan ${plan.plan_key}:`, err);
          throw err;
        }
      };

      // 5. Export Pricing Plans
      const pricingPlans = [
        {
          plan_key: "platinum",
          name: "Platinium Membership Package",
          price: 20000,
          currency: "NGN",
          billing_period: "monthly" as const,
          is_popular: true,
          is_active: true,
          display_order: 1,
          description: "Billed monthly Pause / Cancel anytime",
        },
        {
          plan_key: "gold",
          name: "Gold Membership Package",
          price: 10000,
          currency: "NGN",
          billing_period: "monthly" as const,
          is_popular: false,
          is_active: true,
          display_order: 2,
          description: "Billed monthly Pause / Cancel anytime",
        },
        {
          plan_key: "silver",
          name: "Silver Membership Package",
          price: 5000,
          currency: "NGN",
          billing_period: "monthly" as const,
          is_popular: false,
          is_active: true,
          display_order: 3,
          description: "Billed monthly Pause / Cancel anytime",
        },
        {
          plan_key: "bronze",
          name: "Bronze Membership Package",
          price: 2000,
          currency: "NGN",
          billing_period: "monthly" as const,
          is_popular: false,
          is_active: true,
          display_order: 4,
          description: "Billed monthly Pause / Cancel anytime",
        },
      ];

      for (const plan of pricingPlans) {
        await upsertPricingPlan(plan);
      }

      // 6. Export Pricing Settings
      await pricingApi.updateSettings({
        badge_text: "Jos Smart City Pricing",
        heading: "Our Pricing Plans",
        subheading:
          "Join Jos Smart City and unlock a world of exclusive discounts, rewards, and seamless access to essential services — connecting residents, businesses, and visitors through one powerful digital membership platform that brings your city's marketplace, wallet, and community together.",
        subscribe_button_text: "Subscribe Now",
      });
      console.log("Pricing settings exported");

      // Helper function to upsert contact information
      const upsertContactInfo = async (info: ContactInformation) => {
        try {
          const existing = await contactApi.getInformation();
          const existingInfo = existing.data || existing || [];
          const existingItem = existingInfo.find((i: ContactInformation) => 
            i.title === info.title && i.contact_type === info.contact_type
          );
          
          if (existingItem?.id) {
            await contactApi.updateInformation(existingItem.id, info);
            console.log(`Updated contact info: ${info.title}`);
          } else {
            await contactApi.createInformation(info);
            console.log(`Created contact info: ${info.title}`);
          }
        } catch (err) {
          console.error(`Error upserting contact info ${info.title}:`, err);
          throw err;
        }
      };

      // 7. Export Contact Information
      const contactInfo = [
        {
          contact_type: "phone" as const,
          title: "Phone",
          primary_value: "+234 7067621916",
          secondary_value: "Mon - Sat 24/7",
          icon_color: "#2196F3",
          is_active: true,
          display_order: 1,
        },
        {
          contact_type: "email" as const,
          title: "Email",
          primary_value: "support@afresh.academy",
          secondary_value: "Response in 24 hours",
          icon_color: "#00C950",
          is_active: true,
          display_order: 2,
        },
        {
          contact_type: "location" as const,
          title: "Location",
          primary_value: "Jos City Center",
          secondary_value: "Plateau State, Nigeria",
          icon_color: "#9C27B0",
          is_active: true,
          display_order: 3,
        },
      ];

      for (const info of contactInfo) {
        await upsertContactInfo(info);
      }

      // 8. Export Contact Settings
      await contactApi.updateSettings({
        badge_text: "Contact Us",
        heading: "Get in Touch",
        subheading: "Our support team is available 24/7 to assist you",
      });
      console.log("Contact settings exported");

      // Helper function to upsert footer link
      const upsertFooterLink = async (link: FooterLink) => {
        try {
          const existing = await footerApi.getLinks();
          const existingLinks = existing.data || existing || [];
          const existingLink = existingLinks.find((l: FooterLink) => 
            l.link_text === link.link_text && l.section === link.section
          );
          
          if (existingLink?.id) {
            await footerApi.updateLink(existingLink.id, link);
            console.log(`Updated footer link: ${link.link_text}`);
          } else {
            await footerApi.createLink(link);
            console.log(`Created footer link: ${link.link_text}`);
          }
        } catch (err) {
          console.error(`Error upserting footer link ${link.link_text}:`, err);
          throw err;
        }
      };

      // 9. Export Footer Links
      const footerLinks = [
        // Quick Links
        {
          link_text: "Services",
          link_url: "#services",
          section: "quick_links" as const,
          display_order: 1,
          is_active: true,
        },
        {
          link_text: "About Us",
          link_url: "#about",
          section: "quick_links" as const,
          display_order: 2,
          is_active: true,
        },
        {
          link_text: "Contact",
          link_url: "#contact",
          section: "quick_links" as const,
          display_order: 3,
          is_active: true,
        },
        {
          link_text: "FAQs",
          link_url: "#",
          section: "quick_links" as const,
          display_order: 4,
          is_active: true,
        },
        // Services
        {
          link_text: "Bill Payments",
          link_url: "#",
          section: "services" as const,
          display_order: 1,
          is_active: true,
        },
        {
          link_text: "Permits",
          link_url: "#",
          section: "services" as const,
          display_order: 2,
          is_active: true,
        },
        {
          link_text: "Licenses",
          link_url: "#",
          section: "services" as const,
          display_order: 3,
          is_active: true,
        },
        {
          link_text: "Complaints",
          link_url: "#",
          section: "services" as const,
          display_order: 4,
          is_active: true,
        },
        // Legal
        {
          link_text: "Privacy Policy",
          link_url: "#",
          section: "legal" as const,
          display_order: 1,
          is_active: true,
        },
        {
          link_text: "Terms of Service",
          link_url: "#",
          section: "legal" as const,
          display_order: 2,
          is_active: true,
        },
        {
          link_text: "Cookie Policy",
          link_url: "#",
          section: "legal" as const,
          display_order: 3,
          is_active: true,
        },
        {
          link_text: "Accessibility",
          link_url: "#",
          section: "legal" as const,
          display_order: 4,
          is_active: true,
        },
      ];

      for (const link of footerLinks) {
        await upsertFooterLink(link);
      }

      // 10. Export Footer Settings
      await footerApi.updateSettings({
        logo_url: "/image/primary-logo.png",
        tagline: "Your gateway to smart city services and digital governance.",
        copyright_text: "© 2025 JosCity Smart Services. All rights reserved. Developed by AfrESH",
      });
      console.log("Footer settings exported");

      // 11. Export Guidelines Settings
      await guidelinesApi.updateSettings({
        badge_text: "Guidelines",
        heading: "PWA Guidelines",
      });
      console.log("Guidelines settings exported");

      // 12. Export Default Guideline
      try {
        const existing = await guidelinesApi.getGuidelines();
        const existingGuidelines = existing.data || existing || [];
        const defaultGuideline = existingGuidelines.find((g: Guideline) => 
          g.author_name === "AfrESH Support" && g.display_order === 0
        );

        const guidelineData = {
          quote:
            "Welcome to the Jos Smart City PWA! We're here to help you navigate and enjoy your city with ease. In this phase of the app, kindly click on the green 'Get Started' button to redirect you to an account type panel, select your type of account, carefully fill in your details, an email would be sent to you if submitted successfully, with a login button, your email address and an OTP, kindly change your password after logging in. Your Information is protected and will not be shared with anyone.",
          author_name: "AfrESH Support",
          rating: 5,
          display_order: 0,
          is_active: true,
        };

        if (defaultGuideline?.id) {
          await guidelinesApi.updateGuideline(defaultGuideline.id, guidelineData);
          console.log("Updated default guideline");
        } else {
          await guidelinesApi.createGuideline(guidelineData);
          console.log("Created default guideline");
        }
      } catch (err) {
        console.error("Error upserting guideline:", err);
        throw err;
      }

      alert("Successfully exported all current elements to the database!");
      
      // Reload all data
      await loadTabData(activeTab);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Failed to export elements");
      setError(errorMessage);
      alert(`Error exporting elements: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pages-control-panel">
      <div className="pages-control-panel__overlay" onClick={onClose}></div>
      <div className="pages-control-panel__container">
        <div className="pages-control-panel__header">
          <h2 className="pages-control-panel__title">
            Landing Page Management
          </h2>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              className="control-panel__button control-panel__button--primary"
              onClick={handleExportCurrentElements}
              style={{ fontSize: "14px", padding: "8px 16px" }}
              title="Export current hardcoded elements to database"
            >
              <Plus size={16} style={{ marginRight: "4px" }} />
              Export Current Elements
            </button>
            <button
              className="pages-control-panel__close"
              onClick={onClose}
              aria-label="Close panel"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="pages-control-panel__tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`pages-control-panel__tab ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pages-control-panel__body">{renderTabContent()}</div>

        <div className="pages-control-panel__footer">
          <button
            className="control-panel__button control-panel__button--secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple modal component for Navbar Item editing
const NavbarItemModal: React.FC<{
  item: NavbarMenuItem;
  onClose: () => void;
  onSave: (item: NavbarMenuItem) => void;
}> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<NavbarMenuItem>(item);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10002,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Edit Menu Item</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <input
            type="text"
            placeholder="Label"
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <select
            value={formData.link_type}
            onChange={(e) => {
              const linkType = e.target.value as
                | "scroll"
                | "route"
                | "external";
              setFormData({ ...formData, link_type: linkType });
            }}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="scroll">Scroll</option>
            <option value="route">Route</option>
            <option value="external">External</option>
          </select>
          <input
            type="text"
            placeholder="Target/URL"
            value={formData.link_target || formData.scroll_target_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                link_target:
                  formData.link_type === "external" ||
                  formData.link_type === "route"
                    ? e.target.value
                    : undefined,
                scroll_target_id:
                  formData.link_type === "scroll" ? e.target.value : undefined,
              })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            placeholder="Display Order"
            value={formData.display_order}
            onChange={(e) =>
              setFormData({
                ...formData,
                display_order: parseInt(e.target.value) || 0,
              })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
            />
            Active
          </label>
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "20px",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="control-panel__button control-panel__button--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() => onSave(formData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Contact Information Modal
const ContactInfoModal: React.FC<{
  info: ContactInformation;
  onClose: () => void;
  onSave: (info: ContactInformation) => void;
}> = ({ info, onSave, onClose }) => {
  const [formData, setFormData] = useState<ContactInformation>(info);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10002,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>Edit Contact Information</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <select
            value={formData.contact_type}
            onChange={(e) => {
              const contactType = e.target.value as "phone" | "email" | "location";
              setFormData({ ...formData, contact_type: contactType });
            }}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="location">Location</option>
          </select>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Primary Value"
            value={formData.primary_value}
            onChange={(e) =>
              setFormData({ ...formData, primary_value: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Secondary Value (optional)"
            value={formData.secondary_value || ""}
            onChange={(e) =>
              setFormData({ ...formData, secondary_value: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="color"
            placeholder="Icon Color"
            value={formData.icon_color || "#1a5d3a"}
            onChange={(e) =>
              setFormData({ ...formData, icon_color: e.target.value })
            }
            style={{
              padding: "4px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            placeholder="Display Order"
            value={formData.display_order}
            onChange={(e) =>
              setFormData({
                ...formData,
                display_order: parseInt(e.target.value) || 0,
              })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
            />
            Active
          </label>
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "20px",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="control-panel__button control-panel__button--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() => onSave(formData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Event Modal
const EventModal: React.FC<{
  event: Event;
  onClose: () => void;
  onSave: (event: Event) => void;
}> = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState<Event>(event);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10002,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>Edit Event</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <textarea
            placeholder="Description"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minHeight: "80px",
            }}
          />
          <input
            type="date"
            placeholder="Event Date"
            value={formData.event_date}
            onChange={(e) =>
              setFormData({ ...formData, event_date: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="time"
            placeholder="Event Time"
            value={formData.event_time || ""}
            onChange={(e) =>
              setFormData({ ...formData, event_time: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location || ""}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Venue"
            value={formData.venue || ""}
            onChange={(e) =>
              setFormData({ ...formData, venue: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={formData.image_url || ""}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <select
            value={formData.status || "upcoming"}
            onChange={(e) => {
              const status = e.target.value as
                | "upcoming"
                | "ongoing"
                | "completed"
                | "cancelled";
              setFormData({ ...formData, status });
            }}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="number"
            placeholder="Max Attendees"
            value={formData.max_attendees || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                max_attendees: parseInt(e.target.value) || undefined,
              })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            placeholder="Ticket Price"
            value={formData.ticket_price || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                ticket_price: parseFloat(e.target.value) || undefined,
              })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "20px",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="control-panel__button control-panel__button--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() => onSave(formData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Service Modal
const ServiceModal: React.FC<{
  service: Service;
  onClose: () => void;
  onSave: (service: Service) => void;
}> = ({ service, onSave, onClose }) => {
  const [formData, setFormData] = useState<Service>(service);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10002,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>Edit Service</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <input
            type="text"
            placeholder="Service Key"
            value={formData.service_key}
            onChange={(e) =>
              setFormData({ ...formData, service_key: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minHeight: "80px",
            }}
          />
          <input
            type="color"
            placeholder="Icon Color"
            value={formData.icon_color}
            onChange={(e) =>
              setFormData({ ...formData, icon_color: e.target.value })
            }
            style={{
              padding: "4px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={formData.category || ""}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Service URL (optional)"
            value={formData.service_url || ""}
            onChange={(e) =>
              setFormData({ ...formData, service_url: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            placeholder="Display Order"
            value={formData.display_order}
            onChange={(e) =>
              setFormData({
                ...formData,
                display_order: parseInt(e.target.value) || 0,
              })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
            />
            Active
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.requires_authentication || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requires_authentication: e.target.checked,
                })
              }
            />
            Requires Authentication
          </label>
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "20px",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="control-panel__button control-panel__button--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() => onSave(formData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Pricing Plan Modal
const PricingPlanModal: React.FC<{
  plan: PricingPlan;
  onClose: () => void;
  onSave: (plan: PricingPlan) => void;
}> = ({ plan, onSave, onClose }) => {
  const [formData, setFormData] = useState<PricingPlan>(plan);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10002,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>Edit Pricing Plan</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <input
            type="text"
            placeholder="Plan Key"
            value={formData.plan_key}
            onChange={(e) =>
              setFormData({ ...formData, plan_key: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Plan Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value) || 0,
              })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Currency (e.g., NGN)"
            value={formData.currency || "NGN"}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <select
            value={formData.billing_period || "monthly"}
            onChange={(e) => {
              const billingPeriod = e.target.value as
                | "monthly"
                | "yearly"
                | "one-time";
              setFormData({ ...formData, billing_period: billingPeriod });
            }}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="one-time">One-time</option>
          </select>
          <textarea
            placeholder="Description (optional)"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minHeight: "60px",
            }}
          />
          <input
            type="number"
            placeholder="Display Order"
            value={formData.display_order}
            onChange={(e) =>
              setFormData({
                ...formData,
                display_order: parseInt(e.target.value) || 0,
              })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
            />
            Active
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.is_popular || false}
              onChange={(e) =>
                setFormData({ ...formData, is_popular: e.target.checked })
              }
            />
            Popular Plan
          </label>
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "20px",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="control-panel__button control-panel__button--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() => onSave(formData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Guideline Modal
const GuidelineModal: React.FC<{
  guideline: Guideline;
  onClose: () => void;
  onSave: (guideline: Guideline) => void;
}> = ({ guideline, onSave, onClose }) => {
  const [formData, setFormData] = useState<Guideline>(guideline);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10002,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>Edit Guideline</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <textarea
            placeholder="Quote"
            value={formData.quote}
            onChange={(e) =>
              setFormData({ ...formData, quote: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minHeight: "100px",
            }}
          />
          <input
            type="text"
            placeholder="Author Name"
            value={formData.author_name}
            onChange={(e) =>
              setFormData({ ...formData, author_name: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Author Role (optional)"
            value={formData.author_role || ""}
            onChange={(e) =>
              setFormData({ ...formData, author_role: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            placeholder="Rating (1-5)"
            min="1"
            max="5"
            value={formData.rating || 5}
            onChange={(e) =>
              setFormData({
                ...formData,
                rating: parseInt(e.target.value) || 5,
              })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Author Image URL (optional)"
            value={formData.author_image_url || ""}
            onChange={(e) =>
              setFormData({ ...formData, author_image_url: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            placeholder="Display Order"
            value={formData.display_order}
            onChange={(e) =>
              setFormData({
                ...formData,
                display_order: parseInt(e.target.value) || 0,
              })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
            />
            Active
          </label>
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "20px",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="control-panel__button control-panel__button--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() => onSave(formData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Hero Slide Modal
const HeroSlideModal: React.FC<{
  slide: HeroSlide;
  onClose: () => void;
  onSave: (slide: HeroSlide) => void;
}> = ({ slide, onSave, onClose }) => {
  const [formData, setFormData] = useState<HeroSlide>(slide);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10002,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>Edit Hero Slide</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Subtitle (optional)"
            value={formData.subtitle || ""}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <textarea
            placeholder="Description (optional)"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minHeight: "60px",
            }}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Image Alt Text (optional)"
            value={formData.image_alt || ""}
            onChange={(e) =>
              setFormData({ ...formData, image_alt: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Link URL (optional)"
            value={formData.link_url || ""}
            onChange={(e) =>
              setFormData({ ...formData, link_url: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Link Text (optional)"
            value={formData.link_text || ""}
            onChange={(e) =>
              setFormData({ ...formData, link_text: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Button Text (optional)"
            value={formData.button_text || ""}
            onChange={(e) =>
              setFormData({ ...formData, button_text: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            placeholder="Slide Order"
            value={formData.slide_order}
            onChange={(e) =>
              setFormData({
                ...formData,
                slide_order: parseInt(e.target.value) || 0,
              })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
            />
            Active
          </label>
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "20px",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="control-panel__button control-panel__button--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() => onSave(formData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Footer Link Modal
const FooterLinkModal: React.FC<{
  link: FooterLink;
  onClose: () => void;
  onSave: (link: FooterLink) => void;
}> = ({ link, onSave, onClose }) => {
  const [formData, setFormData] = useState<FooterLink>(link);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10002,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>Edit Footer Link</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <select
            value={formData.section}
            onChange={(e) => {
              const section = e.target.value as
                | "quick_links"
                | "services"
                | "legal"
                | "social";
              setFormData({ ...formData, section });
            }}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="quick_links">Quick Links</option>
            <option value="services">Services</option>
            <option value="legal">Legal</option>
            <option value="social">Social</option>
          </select>
          <input
            type="text"
            placeholder="Link Text"
            value={formData.link_text}
            onChange={(e) =>
              setFormData({ ...formData, link_text: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Link URL"
            value={formData.link_url}
            onChange={(e) =>
              setFormData({ ...formData, link_url: e.target.value })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="number"
            placeholder="Display Order"
            value={formData.display_order}
            onChange={(e) =>
              setFormData({
                ...formData,
                display_order: parseInt(e.target.value) || 0,
              })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
            />
            Active
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.opens_in_new_tab || false}
              onChange={(e) =>
                setFormData({ ...formData, opens_in_new_tab: e.target.checked })
              }
            />
            Opens in New Tab
          </label>
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "20px",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="control-panel__button control-panel__button--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={() => onSave(formData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PagesControlPanel;
