import express from "express";
import { createOrder, getOneTimeOrders, getOrderById, getSellerOrders,getOrderBySellerId,updateOrderStatusBySeller,verifyDeliveryOtp,resendDeliveryOtp,cancelOrder } from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/requireRole.js";

const router=express.Router();

router.post("/create",authMiddleware,requireRole("USER"),createOrder);
router.get("/all",authMiddleware,getOneTimeOrders);
router.get("/seller",authMiddleware,requireRole("SELLER"),getSellerOrders);
router.get("/:id",authMiddleware,getOrderById);
router.get("/seller/:orderId",authMiddleware,requireRole("SELLER"),getOrderBySellerId);
router.patch("/:orderId/status",authMiddleware,requireRole("SELLER"),updateOrderStatusBySeller);
router.patch("/:orderId/verify-otp",authMiddleware,requireRole("USER"),verifyDeliveryOtp);
router.post("/:orderId/resend-otp",authMiddleware,requireRole("USER"),resendDeliveryOtp);
router.post("/:orderId/cancel",authMiddleware,requireRole("USER"),cancelOrder);



export default router;