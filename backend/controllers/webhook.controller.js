import crypto from "crypto";
import Order from "../models/orders.model.js";
import Box from "../models/box.model.js";
import Subscription from "../models/subscription.model.js";
import { calculateNextBillingDate } from "../controllers/subscription.controller.js";
import axios from "axios";

// const N8N_WEBHOOK = "https://boxdrop.app.n8n.cloud/webhook-test/order-update";
export const razorpayWebhook = async (req, res) => {
  console.log("🔥 Razorpay webhook HIT");

  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
const rawBody = Buffer.isBuffer(req.body)
  ? req.body.toString("utf8")
  : JSON.stringify(req.body);

console.log("BODY:", rawBody);
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = JSON.parse(rawBody);

    /* =====================================================
       ✅ PAYMENT SUCCESS
       ===================================================== */
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const notes = payment.notes || {};
    //  console.log(notes.type);
   


    

      /* 🔐 GLOBAL IDEMPOTENCY */
      const alreadyProcessed = await Order.findOne({
        paymentTransactionId: payment.id,
      });
      if (alreadyProcessed) {
        console.log("⚠️ Payment already processed");
        return res.status(200).json({ status: "duplicate" });
      }

      /* ==========================================
         🧾 ONE-TIME ORDER
         ========================================== */
          if (notes.type === "ONE_TIME") {
         try {

  const order = await Order.create({
    userId: notes.userId,
    sellerId: notes.sellerId,
    boxId: notes.boxId,

    shippingAddress: notes.shippingAddress
      ? JSON.parse(notes.shippingAddress)
      : {},

    quantity: 1,
    priceSnapshot: payment.amount / 100,

    paymentProvider: "RAZORPAY",
    paymentMethod: payment.method?.toUpperCase(),
    paymentStatus: "PAID",
    paymentTransactionId: payment.id,
    paymentIntentId: payment.order_id,

    payoutStatus: "HOLD",
    orderType: "ONE_TIME",
    status: "PLACED",
  });

  console.log("✅ ORDER CREATED:", order);

} catch(err) {

  console.error("❌ ORDER CREATE ERROR:");
  console.error(err);

}
     
      //   await Order.create({
      //     userId: notes.userId,
      //     sellerId: notes.sellerId,
      //     boxId: notes.boxId,
      //     shippingAddress: notes.shippingAddress
      //   ? JSON.parse(notes.shippingAddress)
      //   : {},
      //     quantity: 1,
      //     priceSnapshot: payment.amount / 100,

      //     paymentProvider: "RAZORPAY",
      //     paymentMethod: payment.method?.toUpperCase(),
      //     paymentStatus: "PAID",
      //     paymentTransactionId: payment.id,
      //     paymentIntentId: payment.order_id,

      //     payoutStatus: "HOLD",
      //     orderType: "ONE_TIME",
      //     status: "PLACED",
      //   });
// try{
//           await axios.post( {
//   event: "ONE_TIME_ORDER_CREATED",
//   userId: notes.userId,
//   boxId: notes.boxId,
//   type: "ONE_TIME",
// });
// } catch(err){
//   console.error("Failed to notify n8n:", err);
// }

        // console.log("✅ One-time order created");
      }


      /* ==========================================
         🔁 FIRST-TIME SUBSCRIPTION PAYMENT
         ========================================== */
      else if (notes.type === "SUBSCRIPTION") {
        const box = await Box.findById(notes.boxId);
        if (!box) {
          console.error("❌ Box not found");
          return res.status(200).json({ status: "box_missing" });
        }

        const subscription = await Subscription.create({
          userId: notes.userId,
          sellerId: box.sellerId,
          boxId: box._id,
          titleSnapshot: box.title,
          priceSnapshot: box.price,
          billingCycle: box.billingCycle,
          currency: "INR",
          nextBillingDate: calculateNextBillingDate(box.billingCycle),
          status: "ACTIVE",
          retryCount: 0,
        });

        await Order.create({
          userId: notes.userId,
          sellerId: box.sellerId,
          boxId: box._id,
          priceSnapshot: box.price,

          paymentProvider: "RAZORPAY",
          paymentMethod: payment.method?.toUpperCase(),
          paymentStatus: "PAID",
          paymentTransactionId: payment.id,
          paymentIntentId: payment.order_id,

          payoutStatus: "HOLD",
          orderType: "SUBSCRIPTION",
          subscriptionId: subscription._id,
          status: "PLACED",
        });
// try{
//         await axios.post( {
//   event: "SUBSCRIPTION_CREATED",
//   subscriptionId: subscription._id,
//   userId: notes.userId,
//   boxId: box._id,
// });
// } catch(err){
//   console.error("Failed to notify n8n:", err);
// }


        console.log("✅ Subscription + first order created");
      }

      /* ==========================================
         🔁 SUBSCRIPTION RENEWAL
         ========================================== */
      else if (notes.type === "SUBSCRIPTION_RENEWAL") {
        const subscription = await Subscription.findById(notes.subscriptionId);
        if (!subscription) {
          return res.status(200).json({ status: "subscription_missing" });
        }

        await Order.create({
          userId: notes.userId,
          sellerId: notes.sellerId,
          boxId: notes.boxId,
          priceSnapshot: payment.amount / 100,

          paymentProvider: "RAZORPAY",
          paymentMethod: payment.method?.toUpperCase(),
          paymentStatus: "PAID",
          paymentTransactionId: payment.id,
          paymentIntentId: payment.order_id,

          payoutStatus: "HOLD",
          orderType: "SUBSCRIPTION",
          subscriptionId: subscription._id,
          status: "PLACED",
        });

        subscription.lastPaymentStatus = "SUCCESS";
        subscription.retryCount = 0;
        subscription.lastOrderAt = new Date();
        subscription.nextBillingDate =
          calculateNextBillingDate(subscription.billingCycle);

        await subscription.save();
// // try{
//         await axios.post( {
//   event: "SUBSCRIPTION_RENEWAL_SUCCESS",
//   subscriptionId: subscription._id,
//   orderId: payment.order_id,
// });
// } catch(err){
//   console.error("Failed to notify n8n:", err);
// }


        console.log("✅ Subscription renewal successful");
      }
    }

  
   /* =====================================================
   ❌ PAYMENT FAILED (ALL TYPES)
   ===================================================== */
if (event.event === "payment.failed") {
  const payment = event.payload.payment.entity;
  const notes = payment.notes || {};
  const type = notes.type;

  console.log("❌ Payment failed:", type);

  /* ==========================================
     🧾 ONE-TIME PAYMENT FAILED
     ========================================== */
  if (type === "ONE_TIME") {
    // ❌ Do NOTHING (no order should exist)
    console.log("❌ One-time payment failed — no order created");
  }

  /* ==========================================
     🔁 FIRST SUBSCRIPTION PAYMENT FAILED
     ========================================== */
  else if (type === "SUBSCRIPTION") {
    // ❌ Do NOT create subscription
    // ❌ Do NOT create order
    console.log(
      "❌ Subscription initial payment failed — user must retry"
    );
  }

  /* ==========================================
     🔁 SUBSCRIPTION RENEWAL FAILED
     ========================================== */
  else if (type === "SUBSCRIPTION_RENEWAL") {
    const subscription = await Subscription.findById(
      notes.subscriptionId
    );

    if (!subscription) {
      console.warn("⚠️ Subscription not found for failed renewal");
      return res.status(200).json({ status: "ok" });
    }

    subscription.retryCount += 1;
    subscription.lastPaymentStatus = "FAILED";

    // ⏸ Auto-pause after 3 retries
    if (subscription.retryCount >= 3) {
      subscription.status = "PAUSED";
      subscription.pausedAt = new Date();

      console.log(
        "⏸ Subscription paused after 3 failed renewals"
      );
    }

    await subscription.save();

    console.log(
      `❌ Subscription renewal failed (attempt ${subscription.retryCount})`
    );
  }
}

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ message: "Webhook failed" });
  }
};
