import express, { Router } from 'express';
import * as landingPageController from '../../controllers/admin/landingPageController';
import { adminAuth } from '../../middleware/authMiddleware';

const router: Router = express.Router();

// Navbar routes
router.get('/navbar/menu-items', adminAuth, landingPageController.getNavbarMenuItems);
router.post('/navbar/menu-items', adminAuth, landingPageController.createNavbarMenuItem);
router.put('/navbar/menu-items/:id', adminAuth, landingPageController.updateNavbarMenuItem);
router.delete('/navbar/menu-items/:id', adminAuth, landingPageController.deleteNavbarMenuItem);
router.get('/navbar/settings', adminAuth, landingPageController.getNavbarSettings);
router.put('/navbar/settings', adminAuth, landingPageController.updateNavbarSettings);

// Contact routes
router.get('/contact/settings', adminAuth, landingPageController.getContactSettings);
router.put('/contact/settings', adminAuth, landingPageController.updateContactSettings);
router.get('/contact/messages', adminAuth, landingPageController.getContactMessages);
router.get('/contact/messages/:id', adminAuth, landingPageController.getContactMessage);
router.put('/contact/messages/:id', adminAuth, landingPageController.updateContactMessage);
router.delete('/contact/messages/:id', adminAuth, landingPageController.deleteContactMessage);
router.get('/contact/information', adminAuth, landingPageController.getContactInformation);
router.post('/contact/information', adminAuth, landingPageController.createContactInformation);
router.put('/contact/information/:id', adminAuth, landingPageController.updateContactInformation);
router.delete('/contact/information/:id', adminAuth, landingPageController.deleteContactInformation);

// Events routes
router.get('/events/settings', adminAuth, landingPageController.getEventsSettings);
router.put('/events/settings', adminAuth, landingPageController.updateEventsSettings);
router.get('/events', adminAuth, landingPageController.getEvents);
router.get('/events/:id', adminAuth, landingPageController.getEvent);
router.post('/events', adminAuth, landingPageController.createEvent);
router.put('/events/:id', adminAuth, landingPageController.updateEvent);
router.delete('/events/:id', adminAuth, landingPageController.deleteEvent);
router.get('/events/:eventId/registrations', adminAuth, landingPageController.getEventRegistrations);
router.put('/event-registrations/:id', adminAuth, landingPageController.updateEventRegistration);
router.get('/event-registrations', adminAuth, landingPageController.getEventRegistrations);

// Services routes
router.get('/services/settings', adminAuth, landingPageController.getServicesSettings);
router.put('/services/settings', adminAuth, landingPageController.updateServicesSettings);
router.get('/services', adminAuth, landingPageController.getServices);
router.get('/services/:id', adminAuth, landingPageController.getService);
router.post('/services', adminAuth, landingPageController.createService);
router.put('/services/:id', adminAuth, landingPageController.updateService);
router.delete('/services/:id', adminAuth, landingPageController.deleteService);
router.get('/service-requests', adminAuth, landingPageController.getServiceRequests);
router.put('/service-requests/:id', adminAuth, landingPageController.updateServiceRequest);

// Pricing routes
router.get('/pricing/settings', adminAuth, landingPageController.getPricingSettings);
router.put('/pricing/settings', adminAuth, landingPageController.updatePricingSettings);
router.get('/pricing/plans', adminAuth, landingPageController.getPricingPlans);
router.get('/pricing/plans/:id', adminAuth, landingPageController.getPricingPlan);
router.post('/pricing/plans', adminAuth, landingPageController.createPricingPlan);
router.put('/pricing/plans/:id', adminAuth, landingPageController.updatePricingPlan);
router.delete('/pricing/plans/:id', adminAuth, landingPageController.deletePricingPlan);
router.get('/pricing/plans/:planId/features', adminAuth, landingPageController.getPricingPlanFeatures);
router.post('/pricing/plan-features', adminAuth, landingPageController.createPricingPlanFeature);
router.put('/pricing/plan-features/:id', adminAuth, landingPageController.updatePricingPlanFeature);
router.delete('/pricing/plan-features/:id', adminAuth, landingPageController.deletePricingPlanFeature);
router.get('/pricing/subscriptions', adminAuth, landingPageController.getUserSubscriptions);
router.put('/pricing/subscriptions/:id', adminAuth, landingPageController.updateUserSubscription);

// Guidelines routes
router.get('/guidelines/settings', adminAuth, landingPageController.getGuidelinesSettings);
router.put('/guidelines/settings', adminAuth, landingPageController.updateGuidelinesSettings);
router.get('/guidelines', adminAuth, landingPageController.getGuidelines);
router.get('/guidelines/:id', adminAuth, landingPageController.getGuideline);
router.post('/guidelines', adminAuth, landingPageController.createGuideline);
router.put('/guidelines/:id', adminAuth, landingPageController.updateGuideline);
router.delete('/guidelines/:id', adminAuth, landingPageController.deleteGuideline);

// Hero routes
router.get('/hero/settings', adminAuth, landingPageController.getHeroSettings);
router.put('/hero/settings', adminAuth, landingPageController.updateHeroSettings);
router.get('/hero/slides', adminAuth, landingPageController.getHeroSlides);
router.get('/hero/slides/:id', adminAuth, landingPageController.getHeroSlide);
router.post('/hero/slides', adminAuth, landingPageController.createHeroSlide);
router.put('/hero/slides/:id', adminAuth, landingPageController.updateHeroSlide);
router.delete('/hero/slides/:id', adminAuth, landingPageController.deleteHeroSlide);

// Footer routes
router.get('/footer/settings', adminAuth, landingPageController.getFooterSettings);
router.put('/footer/settings', adminAuth, landingPageController.updateFooterSettings);
router.get('/footer/links', adminAuth, landingPageController.getFooterLinks);
router.post('/footer/links', adminAuth, landingPageController.createFooterLink);
router.put('/footer/links/:id', adminAuth, landingPageController.updateFooterLink);
router.delete('/footer/links/:id', adminAuth, landingPageController.deleteFooterLink);

export default router;

