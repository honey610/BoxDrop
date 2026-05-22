import razorpay from "../config/razorpay.js";
import Box from "../models/box.model.js";
import Seller from "../models/seller.model.js";
import Order from "../models/orders.model.js";
import Subscription from "../models/subscription.model.js";

import dotenv from "dotenv";
dotenv.config();


export const createPaymentOrder = async (req, res) => {
    try{
        const userId=req.user._id;
        const {boxId,shippingAddress}=req.body;

       

        //Fetch box details
       const box = await Box.findById(boxId);
    if (!box || !box.isApproved || !box.isActive) {
      return res.status(400).json({ message: "Box not available" });
    }
     if (!box.sellerId) {
      return res.status(500).json({
        message: "Seller not linked to this box",
      });
    }


    if (!shippingAddress || !shippingAddress.addressLine1) {
  return res.status(400).json({
    message: "Shipping address is required",
  });
}

 const seller = await Seller.findOne({ userId:userId});

// 🚫 Prevent seller buying own box
if (seller && seller._id.equals(box.sellerId)) {
  return res.status(403).json({
    message: "Sellers cannot purchase their own box",
  });
}
 

    const amountInPaise = box.price * 100; // Convert to paise

    //Create razorpay order
    const razorpayOrder = await razorpay.orders.create({
        amount:amountInPaise,
        currency:"INR",
        receipt:`rcpt_${Date.now()}`,
        payment_capture:1,
         notes: {
    type: "ONE_TIME", // OR SUBSCRIPTION / SUBSCRIPTION_RENEWAL
    userId: userId.toString(),
    boxId: box._id.toString(),
    sellerId: box.sellerId.toString(),
    shippingAddress: JSON.stringify(shippingAddress),
  },
    });

    // 3️⃣ Create Order in DB (escrow HOLD)
    // const order = await Order.create({
    //   userId,
    //   sellerId: box.sellerId,
    //   boxId: box._id,
    //   shippingAddress,
    //   quantity: 1,
    //   status: "PLACED",
    //   priceSnapshot: box.price,
    //   paymentProvider: "RAZORPAY",
    //   paymentStatus: "PENDING",
    //   paymentIntentId: razorpayOrder.id,
    //   payoutStatus: "HOLD",
    //   orderType: "ONE_TIME",
    //   paymentTransactionId: razorpayOrder.id,

    // });



 

     return res.status(201).json({
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      // orderId: order._id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });


    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server Error"});
    }
}

export const releaseOrderPayout = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // 🔐 Escrow safety checks
    if (order.paymentStatus !== "PAID") {
      throw new Error("Payment not completed");
    }

    if (order.status !== "DELIVERED") {
      throw new Error("Order not delivered yet");
    }

    if (order.payoutStatus !== "HOLD") {
      throw new Error("Payout already processed or not eligible");
    }

    const seller = await Seller.findById(order.sellerId);
    if (!seller ) {
      throw new Error("Seller payout account not configured");
    }
// || !seller.sellerRazorpayAccountId
    // 💰 Create Razorpay transfer (REAL payout)
    // const transfer = await razorpay.transfers.create({
    //   account: seller.sellerRazorpayAccountId,
    //   amount: Math.round(order.priceSnapshot * 100),
    //   currency: "INR",
    //   reference_id: order._id.toString(),
    //   notes: {
    //     orderId: order._id.toString(),
    //     sellerId: seller._id.toString(),
    //   },
    // });

    // ✅ Mark payout released ONLY after success
    order.payoutStatus = "RELEASED";
    order.paidOutAt = new Date();
    // order.payoutTransactionId = transfer.id;

    await order.save();

    // return transfer;
  } catch (err) {
    console.error("Release payout error:", err.message);
    throw err; // important for retries / alerts
  }
};
// export const releaseOrderPayout = async (order) => {
//   try {
//     if (!order) throw new Error("Order missing");

//     // 🔐 Escrow safety checks
//     if (order.paymentStatus !== "PAID") {
//       throw new Error("Payment not completed");
//     }

//     if (order.status !== "DELIVERED") {
//       throw new Error("Order not delivered yet");
//     }

//     if (order.payoutStatus !== "HOLD") {
//       throw new Error("Payout already processed");
//     }

//     const seller = await Seller.findById(order.sellerId);
//     if (!seller) {
//       throw new Error("Seller not found");
//     }

//     // 💰 Razorpay transfer (enable later)
//     // await razorpay.transfers.create(...)

//     order.payoutStatus = "RELEASED";
//     order.paidOutAt = new Date();

//     await order.save();

//     console.log("✅ Payout released:", order._id);
//   } catch (err) {
//     console.error("Release payout error:", err.message);
//     throw err;
//   }
// };

export const refundOrderPayment = async (order, reason) => {
  try{
    // const orderId=req.params.orderId;
    // const order = await Order.findById(orderId);
    // if(!order){
    //   throw new Error("Order not found");
    // }

    if(order.paymentStatus!=="PAID"){
      throw new Error("Payment not completed");
    
    }

     const refund = await razorpay.payments.refund(
      order.paymentTransactionId,
      {
        amount: Math.round(order.priceSnapshot * 100),
        notes: {
          orderId: order._id.toString(),
          reason,
        },
      }
    );
    order.paymentStatus = "REFUNDED";
    order.refundStatus = "COMPLETED";
    order.refundTransactionId = refund.id;
    order.refundedAt = new Date();
    order.payoutStatus = "REFUNDED";
    order.refundReason = reason;
    await order.save();
    

  }catch(err){
     order.refundStatus = "FAILED";
    order.refundReason = err.message;
    await order.save();
    throw err;
  }
}

// subsciption part
// export const chargeSubscriptionOrder = async (order) => {
//   const amount = Math.round(order.priceSnapshot * 100);

//   const razorpayOrder = await razorpay.orders.create({
//     amount,
//     currency: "INR",
//     receipt: `sub_${order._id}`,
//     payment_capture: 1,
//   });

//   order.paymentIntentId = razorpayOrder.id;
//   order.paymentProvider = "RAZORPAY";
//   order.paymentStatus = "PENDING";

//   await order.save();

//   return razorpayOrder;
// };

export const chargeSubscriptionOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { boxId } = req.body;

    // const existing = await Subscription.findOne({
    //   userId,
    //   boxId,
    //   status: "ACTIVE",
    // });

    // if (existing) {
    //   return res.status(200).json({
    //     alreadySubscribed: true,
    //     message: "You already have an active subscription",
    //   });
    // }

    const box = await Box.findById(boxId);
    if (!box || !box.isApproved || !box.isActive) {
      return res.status(400).json({ message: "Box not available" });

    }
 
    const alreadySubscribe=await Subscription.findOne({
      userId,
      boxId,
      status: "ACTIVE",
    });
    if(alreadySubscribe){
      return res.status(409).json({
        // alreadySubscribed: true,
        message: "You already have an active subscription",
      });
    }


    const amount = box.price * 100;

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `sub_${Date.now()}`,
      payment_capture: 1,
      notes: {
        type: "SUBSCRIPTION",
        userId: userId.toString(),
        boxId: boxId.toString(),
      },
    });

    res.json({
      // alreadySubscribed: false,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency: "INR",
      razorpayKey: process.env.RAZORPAY_KEY_ID,

    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Subscription payment init failed" });
  }
};
