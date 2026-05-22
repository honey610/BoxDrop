import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { 
  subscribeToBox, 
  getMySubscriptions, 
  getSubscriptionById,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription
} from "../controllers/subscription.controller.js";

const router = express.Router();

// User subscribes to box
router.post("/:boxId", authMiddleware, subscribeToBox);

// Get user's subscriptions
router.get("/me", authMiddleware, getMySubscriptions);

// Get subscription by ID
router.get("/:subscriptionId", authMiddleware, getSubscriptionById);

// Pause subscription
router.put("/:subscriptionId/pause", authMiddleware, pauseSubscription);

// Resume subscription
router.put("/:subscriptionId/resume", authMiddleware, resumeSubscription);

// Cancel subscription
router.put("/:subscriptionId/cancel", authMiddleware, cancelSubscription);

export default router;
