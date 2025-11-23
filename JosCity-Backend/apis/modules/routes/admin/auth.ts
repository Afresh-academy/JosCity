import express, { Router } from "express";
import * as authController from "../../controllers/authController";
import { adminAuth } from "../../middleware/authMiddleware";

const router: Router = express.Router();

// Admin auth routes - these are admin-only operations
router.get("/pending", adminAuth, authController.getPendingApprovals);
router.post("/approve", adminAuth, authController.approveAccount);
router.post("/reject", adminAuth, authController.rejectAccount);

export default router;
