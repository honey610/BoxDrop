import mongoose from "mongoose";

const boxSchema = new mongoose.Schema(
  {
    // Seller who owns this box
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },

    // Box identity
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    // Subscription details
    billingCycle: {
      type: String,
      enum: ["MONTHLY", "QUARTERLY", "YEARLY"],
      default: "MONTHLY",
    },

    // Content info (not individual SKUs)
    itemsSummary: {
      type: String,
      trim: true,
    },

    // Media
    images: [
      {
        type: String, // URLs
      },
    ],

    // Visibility & moderation
    isActive: {
      type: Boolean,
      default: false, // activated after review if needed
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    approvedAt: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
    },

    // Metrics (cached for performance)
    subscriberCount: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    rejectionReason: {
  type: String,
  default: null,
},
rejectedAt: {
  type: Date,
  default: null,
},
rejectedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
   
  },
  { timestamps: true }
);

export default mongoose.model("Box", boxSchema);
