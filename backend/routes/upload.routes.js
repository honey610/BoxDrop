import express from "express";
import  {upload } from "../middleware/uploadMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
// Single file upload
router.post(
  "/single",    
    authMiddleware,
    upload.single("file"),
    (req, res) => {
      res.json({
        message: "File uploaded successfully",
        file: req.file,
      });
    }
  );

export default router;