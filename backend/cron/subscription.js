import cron from "node-cron";
import Subscription from "../models/subscription.model.js";
import Order from "../models/orders.model.js";
import User from "../models/user.model.js";
import { calculateNextBillingDate } from "../controllers/subscription.controller.js";
import Box from "../models/box.model.js";
import razorpay from "../config/razorpay.js";
import { sendRenewalPaymentLinkEmail } from "../utils/sendEmail.js";

// Run every hour to check for due renewals
cron.schedule("0 * * * *", async () => {
  try {
    console.log("🔁 Subscription cron started");

    const today = new Date();
    // Get subscriptions that are due for renewal (nextBillingDate <= today)
    const subscriptions = await Subscription.find({
      status: "ACTIVE",
      nextBillingDate: { $lte: today },
    });

    console.log(`Found ${subscriptions.length} subscriptions due for renewal`);

    for (const sub of subscriptions) {
      try {
        const box = await Box.findById(sub.boxId);
        if (!box || !box.isActive || !box.isApproved) {
          console.log(`Skipping subscription ${sub._id} - box inactive or not approved`);
          continue;
        }

        // Check if there's already a pending order for this subscription recently
        const recentOrder = await Order.findOne({
          subscriptionId: sub._id,
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
          paymentStatus: "PENDING",
        });

        if (recentOrder) {
          console.log(`Skipping subscription ${sub._id} - recent pending order exists`);
          continue;
        }

        // Get user email
        const user = await User.findById(sub.userId);
        if (!user || !user.email) {
          console.log(`Skipping subscription ${sub._id} - user email not found`);
          continue;
        }

        // Create a Razorpay payment link (this allows user to pay via link)
        const paymentLink = await razorpay.paymentLink.create({
          amount: sub.priceSnapshot * 100,
          currency: "INR",
          description: `Renewal for ${box.title}`,
          customer: {
            name: user.name || "Customer",
            email: user.email,
          },
          notify: {
            sms: true,
            email: true,
          },
          reminder_enable: true,
          notes: {
            type: "SUBSCRIPTION_RENEWAL",
            subscriptionId: sub._id.toString(),
            userId: sub.userId.toString(),
            boxId: sub.boxId.toString(),
            sellerId: box.sellerId.toString(),
          },
        });

        console.log(`✅ Created payment link for subscription ${sub._id}: ${paymentLink.short_url}`);

        // Send email to user with payment link
        try {
          await sendRenewalPaymentLinkEmail({
            to: user.email,
            userName: user.name,
            boxTitle: box.title,
            amount: sub.priceSnapshot,
            paymentLink: paymentLink.short_url,
            expiryDate: new Date(paymentLink.expire_by * 1000).toLocaleDateString(),
          });
          console.log(`📧 Payment link email sent to ${user.email}`);
        } catch (emailErr) {
          console.error(`Failed to send email for subscription ${sub._id}:`, emailErr.message);
        }

      } catch (subErr) {
        console.error(`❌ Failed to process subscription ${sub._id}:`, subErr.message);
        
        // Increment retry count
        sub.retryCount += 1;
        sub.lastPaymentStatus = "FAILED";
        
        // If 3 retries failed, pause the subscription
        if (sub.retryCount >= 3) {
          sub.status = "PAUSED";
          sub.pausedAt = new Date();
          console.log(`⏸ Subscription ${sub._id} paused after 3 failed attempts`);
        }
        
        await sub.save();
      }
    }

    console.log("🔁 Subscription cron completed");
  } catch (err) {
    console.error("❌ Subscription cron failed:", err);
  }
});

// Separate cron to update nextBillingDate for subscriptions that haven't been renewed
// This handles cases where the payment might have failed silently
cron.schedule("0 2 * * *", async () => {
  try {
    console.log("🔁 Subscription nextBillingDate update cron started");

    const today = new Date();
    
    // Find subscriptions that are overdue but still have nextBillingDate in the past
    const overdueSubscriptions = await Subscription.find({
      status: "ACTIVE",
      nextBillingDate: { $lt: today },
    });

    for (const sub of overdueSubscriptions) {
      // Check if there's any recent successful payment
      const recentSuccessOrder = await Order.findOne({
        subscriptionId: sub._id,
        paymentStatus: "PAID",
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });

      if (!recentSuccessOrder) {
        // No successful payment in the last 24 hours - update nextBillingDate anyway
        // This ensures the cron keeps trying
        const oldDate = sub.nextBillingDate;
        sub.nextBillingDate = calculateNextBillingDate(sub.billingCycle);
        console.log(`Updated nextBillingDate for subscription ${sub._id} from ${oldDate} to ${sub.nextBillingDate}`);
        await sub.save();
      }
    }

    console.log("🔁 Subscription nextBillingDate update completed");
  } catch (err) {
    console.error("❌ Subscription nextBillingDate update cron failed:", err);
  }
});
