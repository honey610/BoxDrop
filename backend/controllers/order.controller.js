import Order from "../models/orders.model.js";
import Seller from "../models/seller.model.js";
import Box from "../models/box.model.js";
import crypto from "crypto";
import { sendOtpEmail, sendDeliveryConfirmationEmail, sendDeliveryConfirmationEmailtoSeller, sendOrderConfirmationEmail} from "../utils/sendEmail.js";
import { refundOrderPayment } from "./payment.controller.js";
import { releaseOrderPayout } from "./payment.controller.js";
import mongoose from "mongoose";

export const createOrder=async(req,res)=>{
    try{

        const userId=req.user._id;
        const { boxId, quantity = 1, shippingAddress } = req.body;
        const box = await Box.findById(boxId);
        if (!box) {
          return res.status(404).json({ message: "Box not found" });
        }
        const seller = await Seller.findById(box.sellerId);

       

if (!seller || seller.status !== "APPROVED") {
  return res.status(403).json({
    message: "Seller not found",
  });
}
        const amount = box.price * quantity;
       const order = await Order.create({
      userId,
      sellerId: seller._id,
      boxId: box._id,
      quantity,
      shippingAddress,
      amount,
      status: "PLACED",
      priceSnapshot: box.price,
      payoutStatus: "HOLD",
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "email name")
      .populate("boxId", "title");

    await sendOrderConfirmationEmail({
      to: populatedOrder.userId.email,
      boxTitle: populatedOrder.boxId.title,
      user: populatedOrder.userId,
    });


    return res.status(201).json({
      
      message: "Order placed successfully",
      order,
    });

    }catch(error){
        console.log(error);
    
    }
}




export const getOneTimeOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({
      userId,
      orderType: "ONE_TIME",
    })
      .populate("boxId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "One-time orders fetched",
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
export const getOrderById=async(req,res)=>{
    try{
        const { id } = req.params;
        const order = await Order.findById(id).populate('boxId');
        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json({
          message: "Order fetched successfully",
          order,
        });
      }catch(error){
        console.log(error);
      }
} 

export const getSellerOrders=async(req,res)=>{
  try{
   const userId = req.user._id;

    // 1️⃣ Find seller profile
    const seller = await Seller.findOne({ userId });

    if (!seller) {
      return res.status(403).json({
        message: "Seller not found",
      });
    }

    // 2️⃣ Fetch orders using seller._id
    const orders = await Order.find({
      sellerId: seller._id,
    })
      .populate("boxId", "title")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ orders });
  }catch(error){
    console.log(error);
  }
}

export const getOrderBySellerId=async(req,res)=>{
  try{
    const {orderId}=req.params;

    const order = await Order.findById(orderId).populate("boxId", "title price").populate("userId", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ order });
  }
    catch(error){
      console.log(error);
    }

}

export const updateOrderStatusBySeller=async(req,res)=>{
  try{
    const userId = req.user._id;
    const { orderId } = req.params;
    
    const seller = await Seller.findOne({ userId });
    if (!seller) {
      return res.status(403).json({
        message: "Seller not found",
      });
    }
    const order = await Order.findById(orderId).populate("userId", "email name").populate("boxId", "title");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.sellerId.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.status !=="PLACED"){
      return res.status(400).json({ message: "Only orders with status 'PLACED' can be updated to 'PROCESSING'" });
    }

    if (Date.now() > order.shipBy) {
  return res.status(400).json({
    message: "Shipping deadline missed. Order auto-cancelled.",
  });
}

    const otp=crypto.randomInt(100000,999999).toString();
    order.status = "SHIPPED";
    order.deliveryOtp = otp;
    order.otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    order.otpAttempts = 0;
    order.shippedAt = new Date();

   

    await order.save();
     sendOtpEmail({
      to: order.userId.email,
     otp,
      boxTitle: order.boxId.title,
    }).catch(err => {
  console.error("OTP email failed:", err.message);
});
      // Send OTP to customer's phone number (mocked here)
    console.log(`Delivery OTP for order ${orderId}: ${otp}`);
    res.json({ order });

     

  }catch(error){
    console.log(error);
  }
}


// export const verifyDeliveryOtp = async (req, res) => {
//   const session=await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const userId = req.user._id;
//     const { orderId } = req.params;
    
//     const { otp } = req.body;

//     const order = await Order.findById(orderId).populate("userId", "email name").populate("boxId", "title");
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     if (order.userId._id.toString() !== userId.toString()) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     if (order.status !== "SHIPPED") {
//       return res.status(400).json({ message: "Order not ready for delivery" });
//     }

//     if (Date.now() > order.otpExpiresAt) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     if (order.otpAttempts >= 3) {
//       return res.status(400).json({ message: "OTP attempts exceeded" });
//     }

//     if (order.deliveryOtp !== otp) {
//       order.otpAttempts += 1;
//       await order.save();
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

    

//     // ✅ Success
//     order.status = "DELIVERED";
     
//     order.deliveredAt = new Date();
//     order.deliveryOtp = null;
//     order.otpExpiresAt = null;
//     order.otpAttempts = 0;
//     await order.save();
   
    
//     if(order.paymentStatus==="PAID"&&order.payoutStatus==="HOLD"&&order.status==="DELIVERED"){
//       // order.payoutStatus = "RELEASED"; // Release escrow
//       // order.paidOutAt=new Date();
//         await releaseOrderPayout(order._id);
//     }
  

    

    

    


//     await Box.findByIdAndUpdate(order.boxId, {
//   $inc: { subscriberCount: 1 },
// });
// await sendDeliveryConfirmationEmail({
//       to: order.userId.email,
//       boxTitle: order.boxId.title,
//       user: order.userId,
//     });
  
//    const seller = await Seller.findById(order.sellerId)
//   .populate("userId", "email name");
//     await sendDeliveryConfirmationEmailtoSeller({
//       to: seller.userId.email,
//       boxTitle: order.boxId.title,
//       user: seller.brandName,
//     });


//     res.json({
//       message: "Delivery confirmed successfully",
//       order,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "OTP verification failed" });
//   }
// };

export const resendDeliveryOtp = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params; 
    const order = await Order.findById(orderId).populate("userId", "email name").populate("boxId", "title");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    } 
    if (order.status !== "SHIPPED") {
      return res.status(400).json({ message: "Order not ready for delivery" });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    order.deliveryOtp = otp;
    order.otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    order.otpAttempts = 0;
   
    await order.save();
     sendOtpEmail({
      to: order.userId.email,
      otp,
      boxTitle: order.boxId.title,
    });
    console.log(`Delivery OTP for order ${orderId}: ${otp}`);
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to resend OTP" });
  } 
}
// export const verifyDeliveryOtp = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   let order; // needed in catch

//   try {
//     const userId = req.user._id;
//     const { orderId } = req.params;
//     const { otp } = req.body;

//     order = await Order.findById(orderId)
//       .populate("userId", "email name")
//       .populate("boxId", "title")
//       .session(session);

//     if (!order) throw new Error("Order not found");

//     if (order.userId._id.toString() !== userId.toString()) {
//       throw new Error("Unauthorized");
//     }

//     if (order.status !== "SHIPPED") {
//       throw new Error("Order not ready for delivery");
//     }

//     if (Date.now() > order.otpExpiresAt) {
//       throw new Error("OTP expired");
//     }

//     if (order.otpAttempts >= 3) {
//       throw new Error("OTP attempts exceeded");
//     }

//     if (order.deliveryOtp !== otp) {
//       order.otpAttempts += 1;
//       await order.save({ session });
//       throw new Error("Invalid OTP");
//     }

//     // ✅ DELIVERY SUCCESS
//     order.status = "DELIVERED";
//     order.deliveredAt = new Date();
//     order.deliveryOtp = null;
//     order.otpExpiresAt = null;
//     order.otpAttempts = 0;

//     await order.save({ session });

//     // ✅ PAY SELLER (ESCROW RELEASE)
//     if (
//       order.paymentStatus === "PAID" &&
//   order.payoutStatus === "HOLD" &&
//   order.status === "DELIVERED"
//     ) {
//       await releaseOrderPayout(order._id);
//     }

//     // ✅ UPDATE SUBSCRIBER COUNT
//     await Box.findByIdAndUpdate(
//       order.boxId._id,
//       { $inc: { subscriberCount: 1 } },
//       { session }
//     );

//     // ✅ COMMIT EVERYTHING
//     await session.commitTransaction();
//     session.endSession();
//     console.log(order.userId.name);

//     // ✅ SEND EMAILS ONLY AFTER SUCCESS
//     await sendDeliveryConfirmationEmail({
//       to: order.userId.email,
//       boxTitle: order.boxId.title,
//       user: order.userId.name||"Customer",
//     });

//     const seller = await Seller.findById(order.sellerId)
//       .populate("userId", "email name");

//     await sendDeliveryConfirmationEmailtoSeller({
//       to: seller.userId.email,
//       boxTitle: order.boxId.title,
//       user: seller.brandName || seller.userId.name||"Seller",
//     });

//     return res.json({
//       message: "Delivery confirmed successfully",
//       order,
//     });

//   } catch (err) {
//     await session.abortTransaction();
//   session.endSession();

//   console.error("Delivery error:", err.message);

//   const isUserError = [
//     "Invalid OTP",
//     "OTP expired",
//     "OTP attempts exceeded",
//   ].includes(err.message);

//   // 🔁 REFUND ONLY FOR SYSTEM ERRORS
//   if (!isUserError && order?.paymentStatus === "PAID") {
//     try {
//       await refundOrderPayment(order, err.message);
//     } catch (refundErr) {
//       console.error("Refund failed:", refundErr.message);
//     }
//   }

//   return res.status(400).json({
//     message: isUserError
//       ? err.message
//       : "Delivery failed due to system issue. Amount refunded.",
//   });
//   }
// };
export const verifyDeliveryOtp = async (req, res) => {
  const session = await mongoose.startSession();
  let order;
  let shouldReleasePayout = false;

  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    const { otp } = req.body;

    // 🔐 TRANSACTION: DB ONLY
    await session.withTransaction(async () => {
      order = await Order.findById(orderId)
        .populate("userId", "email name")
        .populate("boxId", "title")
        .session(session);

      if (!order) throw new Error("Order not found");

      if (order.userId._id.toString() !== userId.toString()) {
        throw new Error("Unauthorized");
      }

      // ✅ Idempotency: already delivered
      if (order.status === "DELIVERED") {
        return;
      }

      if (order.status !== "SHIPPED") {
        throw new Error("Order not ready for delivery");
      }

      if (Date.now() > order.otpExpiresAt) {
        throw new Error("OTP expired");
      }

      if (order.otpAttempts >= 3) {
        throw new Error("OTP attempts exceeded");
      }

      if (order.deliveryOtp !== otp) {
        order.otpAttempts += 1;
        await order.save({ session });
        throw new Error("Invalid OTP");
      }

      // ✅ DELIVERY SUCCESS (DB ONLY)
      order.status = "DELIVERED";
      order.deliveredAt = new Date();
      order.deliveryOtp = null;
      order.otpExpiresAt = null;
      order.otpAttempts = 0;

      await order.save({ session });

      // ✅ Update subscriber count
      await Box.findByIdAndUpdate(
        order.boxId._id,
        { $inc: { subscriberCount: 1 } },
        { session }
      );

      // Decide payout AFTER commit
      if (
        order.paymentStatus === "PAID" &&
        order.payoutStatus === "HOLD"
      ) {
        shouldReleasePayout = true;
      }
    });

    session.endSession();

    // 🔥 SIDE EFFECTS (OUTSIDE TRANSACTION)

    // 💸 Release payout safely
    if (shouldReleasePayout) {
      releaseOrderPayout(order._id).catch(err => {
        console.error("Payout failed:", err.message);
      });
    }
// console.log("order.userId.name:", order.userId.name);
    // 📧 Send emails (fire & forget)
    sendDeliveryConfirmationEmail({
      to: order.userId.email,
      boxTitle: order.boxId.title,
      user: order.userId.name || "Customer",
    }).catch(console.error);

    const seller = await Seller.findById(order.sellerId)
      .populate("userId", "email name");

    if (seller) {
      sendDeliveryConfirmationEmailtoSeller({
        to: seller.userId.email,
        boxTitle: order.boxId.title,
        user: seller.brandName || seller.userId.name || "Seller",
      }).catch(console.error);
    }

    return res.json({
      message: "Delivery confirmed successfully",
      order,
    });

  } catch (err) {
    session.endSession();

    console.error("Delivery error:", err.message);

    const userErrors = [
      "Invalid OTP",
      "OTP expired",
      "OTP attempts exceeded",
      "Order not ready for delivery",
      "Unauthorized",
      "Order not found",
    ];

    return res.status(400).json({
      message: userErrors.includes(err.message)
        ? err.message
        : "Delivery verification failed",
    });
  }
};


export const cancelOrder=async(req,res)=>{
  try{
    const userId=req.user._id;
    const {orderId}=req.params;
    const {reason}=req.body;
    if(!reason){
      return res.status(400).json({message:"Reason is required"});
    }
    const order=await Order.findById(orderId);
    if(!order){
      return res.status(404).json({message:"Order not found"});
    }
    if(order.userId.toString()!==userId.toString()){
      return res.status(403).json({message:"Unauthorized"});
    }
    if(order.status!=="PLACED"){
      return res.status(400).json({message:"Only orders with status 'PLACED' can be cancelled"});
    }
    order.status="CANCELLED";
    order.rejectionReason=reason;
    order.cancelledAt=new Date();
    await order.save();
    res.json({message:"Order cancelled successfully",order});

  }catch(error){
    console.log(error);
  }
}

// export const refundOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (order.payoutStatus !== "HOLD") {
//       return res.status(400).json({
//         message: "Refund not allowed after payout release",
//       });
//     }

//     // 🔴 Mark refund (actual Razorpa`y refund comes later)
//     order.paymentStatus = "REFUNDED";
//     order.payoutStatus = "REFUNDED";
//     order.status = "CANCELLED";

//     await order.save();

//     return res.json({
//       message: "Refund initiated successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Refund error:", error);
//     return res.status(500).json({
//       message: "Failed to refund order",
//     });
//   }
// };


                   


