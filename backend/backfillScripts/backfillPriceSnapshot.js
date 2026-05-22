import mongoose from "mongoose";
import Order from "../models/orders.model.js";
import Box from "../models/box.model.js";
import dotenv from "dotenv";

dotenv.config();

async function backfillPriceSnapshot() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // 1️⃣ Find orders missing priceSnapshot
    const orders = await Order.find({
      priceSnapshot: { $exists: false },
    });

    console.log(`🔍 Found ${orders.length} orders to backfill`);

    for (const order of orders) {
      const box = await Box.findById(order.boxId);

      if (!box) {
        console.warn(`⚠️ Box not found for order ${order._id}`);
        continue;
      }

      order.priceSnapshot = box.price;
      await order.save();

      console.log(
        `✔ Updated order ${order._id} with priceSnapshot ${box.price}`
      );
    }

    console.log("🎉 Backfill completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Backfill failed:", error);
    process.exit(1);
  }
}

backfillPriceSnapshot();
