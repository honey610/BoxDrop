import Router from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createPaymentOrder,chargeSubscriptionOrder } from "../controllers/payment.controller.js";

const router=Router();

router.post("/create-order",authMiddleware,createPaymentOrder);
router.post("/charge-subscription",authMiddleware,chargeSubscriptionOrder);

export default router;