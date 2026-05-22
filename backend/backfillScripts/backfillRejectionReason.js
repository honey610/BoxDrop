import Seller from "../models/seller.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function backfillRejectionReason() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const sellers = await Seller.find({
      status: "REJECTED",
      rejectionReason: { $exists: false },
    });

    for (const seller of sellers) {
      seller.rejectionReason = "No comments";
      await seller.save();
    }

    console.log(`✅ Updated ${sellers.length} sellers`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
}

backfillRejectionReason();
