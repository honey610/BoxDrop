import mongoose from "mongoose";

const OrderSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller",
        required:true,
    },
    boxId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Box",
        required:true,

    },

    orderType: {
  type: String,
  enum: ["ONE_TIME", "SUBSCRIPTION","SUBSCRIPTION_RENEWAL"],
  default: "ONE_TIME",
  index: true,
},

subscriptionId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Subscription",
  default: null,
  index: true,
},

    quantity: {
      type: Number,
      default: 1,
    },

    shippingAddress:{
        name: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,

    },
    status: {
      type: String,
      enum: ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },

    rejectionReason: {
      type: String,
      default: null,
    },
   
    priceSnapshot: {
      type: Number,
      required: true,
    },

    deliveryOtp: {
  type: String,
},

otpExpiresAt: {
  type: Date,
},

otpAttempts: {
  type: Number,
  default: 0,
},

billingCycleDate: {
  type: Date,
  index: true,
},



    // 🔐 Escrow logic
    payoutStatus: {
      type: String,
      enum: ["HOLD", "RELEASED", "REFUNDED"],
      default: "HOLD",
    },
    // 💳 Payment info
paymentProvider: {
  type: String,
  enum: ["RAZORPAY"],
  default: "RAZORPAY",
},

paymentMethod: {
  type: String,
  enum: ["UPI", "CARD", "NETBANKING"],
},

paymentStatus: {
  type: String,
  enum: ["CREATED", "PAID", "FAILED", "REFUNDED"],
  default: "CREATED",
},

paymentIntentId: {
  type: String, // Razorpay order_id
},

paymentTransactionId: {
  type: String, // Razorpay payment_id
},

payoutTransactionId: {
  type: String, // Razorpay transfer_id
  unique: true,
  sparse: true,
},


paymentSignature: {
  type: String, // webhook verification
},

paidAt: Date,
paidOutAt: {
  type: Date,
},

refundStatus: {
  type: String,
  enum: ["NONE", "INITIATED", "COMPLETED", "FAILED"],
  default: "NONE",
},

refundReason: {
  type: String,
},

refundTransactionId: {
  type: String,
},


refundedAt: Date,

shipBy: {
  type: Date,
  default: () =>
        new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
},

autoCancelledAt: Date,


    
},


{
    timestamps:true,


})

export default mongoose.model("Order",OrderSchema);

