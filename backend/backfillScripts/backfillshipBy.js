import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../models/orders.model.js";

dotenv.config({ path: "../.env" });

async function backfillshipBy() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const HOURS_TO_SHIP = 48;

    const result = await Order.updateMany(
      { shipBy: { $exists: false } },
      [
        {
          $set: {
            shipBy: {
              $add: ["$createdAt", HOURS_TO_SHIP * 60 * 60 * 1000],
            },
          },
        },
      ],
      { updatePipeline: true } // 🔑 REQUIRED
    );

    console.log("✅ Backfill complete:", {
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Backfill failed:", err);
    process.exit(1);
  }
}

backfillshipBy();
