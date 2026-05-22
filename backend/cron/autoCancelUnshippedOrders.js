// import cron from "node-cron";
// import Order from "../models/orders.model.js";
// import { refundOrderPayment } from "../controllers/payment.controller.js";

// const HOURS_TO_SHIP = 48;
// const fallbackDate = new Date(
//   Date.now() - HOURS_TO_SHIP * 60 * 60 * 1000
// );

// cron.schedule("*/30 * * * *", async () => {
//   console.log("🔁 Checking unshipped orders");

//   const expiredOrders = await Order.find({
//     status: "PLACED",
//   paymentStatus: "PAID",
//   $or: [
//     { shipBy: { $lt: new Date() } },
//     { shipBy: { $exists: false }, createdAt: { $lt: fallbackDate } },
//   ],
//   });

//   for (const order of expiredOrders) {
//     try {
//       order.status = "CANCELLED";
//       order.autoCancelledAt = new Date();
//       await order.save();
//       console.log("order saved", order._id);

//       await refundOrderPayment(order, "Seller failed to ship order");

//       console.log("💸 Refunded order:", order._id);
//     } catch (err) {
//       console.error("Auto-cancel failed:", order._id, err.message);
//     }
//   }
// });