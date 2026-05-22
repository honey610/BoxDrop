import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    // Link to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one seller profile per user
    },

    // Business / brand info
    brandName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // Approval workflow
    isApproved: {
      type: Boolean,
      default: false,
    },

    approvedAt: {
      type: Date,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin user
    },

    // Platform state
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
      default: "PENDING",
    },
    rejectionReason: {
      type: String,
    },

    rejectionCount: {
  type: Number,
  default: 0,
},

isBlocked: {
  type: Boolean,
  default: false,
},

blockedAt: Date,

blockReason: String,


    plan:{
      type:String,
      enum:["FREE","PRO"],
      default:"FREE"

    },
    monthlyBoxLimit:{
      type:Number,
      default:5
    },
    boxesCreatedThisMonth:{
      type:Number,
      default:0
    },
    planExpiresAt:{
      type:Date,
      default:null
    },


    // Integrations (future-ready)
    shopifyConnected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Seller", sellerSchema);
