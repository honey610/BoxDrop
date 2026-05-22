import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/requireRole.js";
import { createBox,updateBox, approveBox,rejectBox,getSellerBoxes,getPendingBoxes,getTotalBoxesCount } from "../controllers/box.controller.js";
import { listPublicBoxes } from "../controllers/box.controller.js";
import { getBoxById } from "../controllers/box.controller.js";
import { upload } from "../middleware/uploadMiddleware.js";
// import multer from "multer";



const router = express.Router();



// Public: list all approved boxes
router.get("/", listPublicBoxes);
router.get(
  "/my",
  authMiddleware,
  requireRole("SELLER"),
  getSellerBoxes
);

// Admin-only: get pending boxes
router.get(
  "/pending",
  authMiddleware,
  requireRole("ADMIN"),
  getPendingBoxes
);


// Get total boxes count
router.get(
  "/total",
  authMiddleware,
  requireRole("ADMIN"),
  getTotalBoxesCount
);


// Public: get box by ID
router.get("/:boxId", getBoxById);

// Seller-only: create box
router.post(
  "/create",
  authMiddleware,
  requireRole("SELLER"),
  // upload.array("images"),
upload.array("images", 5),
  createBox
);

// Seller-only: get seller's boxes



// Seller-only: update box
router.put(
  "/update/:boxId",
  authMiddleware,
  requireRole("SELLER"),
  updateBox
);



// Admin-only: approve box
router.post(
  "/approve/:boxId",
  authMiddleware,
  requireRole("ADMIN"),
  approveBox
);

// Admin-only: reject box
router.post(
  "/reject/:boxId",
  authMiddleware,
  requireRole("ADMIN"),
  rejectBox
);






export default router;
