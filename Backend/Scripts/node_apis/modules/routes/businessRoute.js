const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");

// Public routes
router.post("/register", businessController.registerBusiness);

// Protected routes
router.get("/profile/:business_id", businessController.getBusinessProfile);
router.get("/admin/pending", businessController.getPendingBusinesses);

module.exports = router;
