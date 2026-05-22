import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { applyForSeller, approveSeller,reApplyForSeller, getStatusPendingSellers, rejectSeller,getMySellerStatus,getTotalSellersCount,getTotalSubscribersforSeller,getTotalLiveBoxesforSeller,calculateSellerRevenue,getSellerBoxPerformance,calcSellerTrustScore,getSellerRevenueTrend,getSellerSubscriptions } from "../controllers/seller.controller.js";
import { requireRole } from "../middleware/requireRole.js";
import { getSellerAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyForSeller);
router.post("/reapply", authMiddleware, reApplyForSeller);
router.get("/pending", authMiddleware, requireRole("ADMIN"), getStatusPendingSellers);
router.get("/total", authMiddleware, requireRole("ADMIN"), getTotalSellersCount);
router.post("/reject/:sellerId", authMiddleware, requireRole("ADMIN"), rejectSeller);
router.post(
  "/approve/:sellerId",
  authMiddleware,
  requireRole("ADMIN"),
  approveSeller
);
router.get("/my-status", authMiddleware, getMySellerStatus);
router.get("/subscribers-count", authMiddleware,requireRole("SELLER"), getTotalSubscribersforSeller);
router.get("/live-boxes-count", authMiddleware,requireRole("SELLER"), getTotalLiveBoxesforSeller);
router.get("/revenue", authMiddleware,requireRole("SELLER"), calculateSellerRevenue);
router.get("/box-performance", authMiddleware,requireRole("SELLER"), getSellerBoxPerformance);
router.get("/trust-score", authMiddleware,requireRole("SELLER"), calcSellerTrustScore);
router.get("/revenue-trend", authMiddleware,requireRole("SELLER"), getSellerRevenueTrend);
router.get("/analytics", authMiddleware, getSellerAnalytics);
router.get("/subscriptions", authMiddleware,requireRole("SELLER"), getSellerSubscriptions);

// router.post("/approve/:sellerId", (req, res) => {
//   res.json({
//     message: "ROUTE HIT",
//     sellerId: req.params.sellerId,
//   });
// });
export default router;
