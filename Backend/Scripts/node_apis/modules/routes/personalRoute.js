const express = require("express");
const router = express.Router();
const personalController = require("../controllers/personalController");

// Public routes
router.post("/register", personalController.registerPersonal);

// Protected routes
router.get("/profile/:personal_id", personalController.getPersonalProfile);
router.get("/admin/pending", personalController.getPendingPersonals);

module.exports = router;

