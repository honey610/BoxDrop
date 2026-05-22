
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },

    boxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Box",
      required: true,
      index: true,
    },

    /* 📦 Snapshot fields */
    titleSnapshot: {
      type: String,
      required: true,
    },

    priceSnapshot: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    billingCycle: {
      type: String,
      enum: ["MONTHLY", "QUARTERLY", "YEARLY"],
      required: true,
    },

    /* 🔁 Subscription state */
    status: {
      type: String,
      enum: ["ACTIVE", "PAUSED", "CANCELLED"],
      default: "ACTIVE",
      index: true,
    },

    nextBillingDate: {
      type: Date,
      required: true,
      index: true,
    },

    lastOrderAt: Date,

    cancelReason: String,

    startedAt: {
      type: Date,
      default: Date.now,
    },

    cancelledAt: Date,
    retryCount: {
  type: Number,
  default: 0,
},

lastPaymentStatus: {
  type: String,
  enum: ["SUCCESS", "FAILED"],
},

pausedAt: Date,
  },
  { timestamps: true }
);

/* 🚫 Prevent duplicate active subscriptions */
subscriptionSchema.index(
  { userId: 1, boxId: 1 },
  { unique: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
