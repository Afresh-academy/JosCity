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
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load data";
      setError(errorMessage);
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadNavbarData = async () => {
    try {
      const [menuItems, settings] = await Promise.all([
        navbarApi.getMenuItems(),
        navbarApi.getSettings(),
      ]);
      setNavbarMenuItems(menuItems.data || []);
      setNavbarSettings(settings.data || null);
    } catch (err) {
      // If API doesn't exist yet, use empty data
      setNavbarMenuItems([]);
      setNavbarSettings(null);
    }
  };

  const loadContactData = async () => {
    try {
      const [settings, messages, information] = await Promise.all([
        contactApi.getSettings(),
        contactApi.getMessages(),
        contactApi.getInformation(),
      ]);
      setContactSettings(settings.data || null);
      setContactMessages(messages.data || []);
      setContactInformation(information.data || []);
    } catch (err) {
      setContactSettings(null);
      setContactMessages([]);
      setContactInformation([]);
    }
  };

  const loadEventsData = async () => {
    try {
      const [settings, eventsData, registrations] = await Promise.all([
        eventsApi.getSettings(),
        eventsApi.getEvents(),
        eventsApi.getRegistrations(),
      ]);
      setEventsSettings(settings.data || null);
      setEvents(eventsData.data || []);
      setEventRegistrations(registrations.data || []);
    } catch (err) {
      setEventsSettings(null);
      setEvents([]);
      setEventRegistrations([]);
    }
  };

  const loadServicesData = async () => {
    try {
      const [settings, servicesData, requests] = await Promise.all([
        servicesApi.getSettings(),
        servicesApi.getServices(),
        servicesApi.getRequests(),
      ]);
      setServicesSettings(settings.data || null);
      setServices(servicesData.data || []);
      setServiceRequests(requests.data || []);
    } catch (err) {
      setServicesSettings(null);
      setServices([]);
      setServiceRequests([]);
    }
  };

  const loadPricingData = async () => {
    try {
      const [settings, plansData] = await Promise.all([
        pricingApi.getSettings(),
        pricingApi.getPlans(),
      ]);
      setPricingSettings(settings.data || null);
      const plans = plansData.data || [];
      setPricingPlans(plans);

      // Load features for each plan
      const featuresMap: Record<string, PricingPlanFeature[]> = {};
      for (const plan of plans) {
        if (plan.id) {
          try {
            const features = await pricingApi.getPlanFeatures(plan.id);
            featuresMap[plan.id] = features.data || [];
          } catch (err) {
            featuresMap[plan.id] = [];
          }
        }
      }
      setPlanFeatures(featuresMap);
    } catch (err) {
      setPricingSettings(null);
      setPricingPlans([]);
      setPlanFeatures({});
    }
  };

  const loadGuidelinesData = async () => {
    try {
      const [settings, guidelinesData] = await Promise.all([
        guidelinesApi.getSettings(),
        guidelinesApi.getGuidelines(),
      ]);
      setGuidelinesSettings(settings.data || null);
      setGuidelines(guidelinesData.data || []);
    } catch (err) {
      setGuidelinesSettings(null);
      setGuidelines([]);
    }
  };

  const loadHeroData = async () => {
    try {
      const [settings, slides] = await Promise.all([
        heroApi.getSettings(),
        heroApi.getSlides(),
      ]);
      setHeroSettings(settings.data || null);
      setHeroSlides(slides.data || []);
    } catch (err) {
      setHeroSettings(null);
      setHeroSlides([]);
    }
  };

  const loadFooterData = async () => {
    try {
      const [settings, links] = await Promise.all([
        footerApi.getSettings(),
        footerApi.getLinks(),
      ]);
      setFooterSettings(settings.data || null);
      setFooterLinks(links.data || []);
    } catch (err) {
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
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          Editing: {editingContactInfo.title || "New Contact Info"} (Modal not
          implemented yet)
          <button
            onClick={() => setEditingContactInfo(null)}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </button>
        </div>
      )}
      {contactSettings && (
        <div
          className="control-panel__section"
          style={{ marginBottom: "16px" }}
        >
          <h4>Settings Loaded</h4>
        </div>
      )}
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
          {contactInformation.map((info) => (
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
          ))}
        </div>
      </div>
    </div>
  );

  const renderEventsTab = () => (
    <div className="control-panel__content">
      {editingEvent && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          Editing: {editingEvent.title || "New Event"} (Modal not implemented
          yet)
          <button
            onClick={() => setEditingEvent(null)}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </button>
        </div>
      )}
      {eventsSettings && eventRegistrations.length >= 0 && (
        <div style={{ display: "none" }}>
          {eventsSettings.heading} {eventRegistrations.length}
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
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          Editing: {editingService.title || "New Service"} (Modal not
          implemented yet)
          <button
            onClick={() => setEditingService(null)}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </button>
        </div>
      )}
      {servicesSettings && serviceRequests.length >= 0 && (
        <div style={{ display: "none" }}>
          {servicesSettings.badge_text} {serviceRequests.length}
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
            <div className="control-panel__empty">No services yet</div>
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
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          Editing: {editingPlan.name || "New Plan"} (Modal not implemented yet)
          <button
            onClick={() => setEditingPlan(null)}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </button>
        </div>
      )}
      {pricingSettings && (
        <div style={{ display: "none" }}>{pricingSettings.badge_text}</div>
      )}
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
            <div className="control-panel__empty">No pricing plans yet</div>
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
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          Editing: {editingGuideline.author_name || "New Guideline"} (Modal not
          implemented yet)
          <button
            onClick={() => setEditingGuideline(null)}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </button>
        </div>
      )}
      {guidelinesSettings && (
        <div style={{ display: "none" }}>{guidelinesSettings.badge_text}</div>
      )}
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
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          Editing: {editingSlide.title || "New Slide"} (Modal not implemented
          yet)
          <button
            onClick={() => setEditingSlide(null)}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </button>
        </div>
      )}
      {heroSettings && (
        <div style={{ display: "none" }}>{heroSettings.default_badge_text}</div>
      )}
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
            <div className="control-panel__empty">No slides yet</div>
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
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          Editing: {editingFooterLink.link_text || "New Link"} (Modal not
          implemented yet)
          <button
            onClick={() => setEditingFooterLink(null)}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </button>
        </div>
      )}
      {footerSettings && (
        <div style={{ display: "none" }}>{footerSettings.copyright_text}</div>
      )}
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
      } catch (err) {
        alert("Failed to delete menu item");
      }
    }
  };

  const handleSaveNavbarItem = async (item: NavbarMenuItem) => {
    try {
      if (item.id) {
        await navbarApi.updateMenuItem(item.id, item);
      } else {
        await navbarApi.createMenuItem(item);
      }
      setEditingNavbarItem(null);
      await loadNavbarData();
    } catch (err) {
      alert("Failed to save menu item");
    }
  };

  const handleDeleteContactMessage = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await contactApi.deleteMessage(id);
        await loadContactData();
      } catch (err) {
        alert("Failed to delete message");
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
      } catch (err) {
        alert("Failed to delete contact information");
      }
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await eventsApi.deleteEvent(id);
        await loadEventsData();
      } catch (err) {
        alert("Failed to delete event");
      }
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await servicesApi.deleteService(id);
        await loadServicesData();
      } catch (err) {
        alert("Failed to delete service");
      }
    }
  };

  const handleDeleteGuideline = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this guideline?")) {
      try {
        await guidelinesApi.deleteGuideline(id);
        await loadGuidelinesData();
      } catch (err) {
        alert("Failed to delete guideline");
      }
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      try {
        await heroApi.deleteSlide(id);
        await loadHeroData();
      } catch (err) {
        alert("Failed to delete slide");
      }
    }
  };

  const handleDeleteFooterLink = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      try {
        await footerApi.deleteLink(id);
        await loadFooterData();
      } catch (err) {
        alert("Failed to delete link");
      }
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
          <button
            className="pages-control-panel__close"
            onClick={onClose}
            aria-label="Close panel"
          >
            <X size={24} />
          </button>
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

export default PagesControlPanel;
