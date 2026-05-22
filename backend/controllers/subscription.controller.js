import Subscription from "../models/subscription.model.js";
import Box from "../models/box.model.js";
import Seller from "../models/seller.model.js";

export const calculateNextBillingDate = (billingCycle) => {
  const now = new Date();
  let nextDate = new Date(now);
  switch (billingCycle) {
    case "MONTHLY":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "QUARTERLY":
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case "YEARLY":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      throw new Error("Invalid billing cycle");
  }
  return nextDate;
};

export const alreadySubscribed = async (userId, boxId) => {
  const existingSub = await Subscription.findOne({
    userId,
    boxId,
    status: "ACTIVE",
  });
  return !!existingSub;
};

// export const subscribeToBox = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { boxId } = req.params;

//     // 1️⃣ Find approved & active box
//     const box = await Box.findOne({
//       _id: boxId,
      
//       isApproved: true,
//       isActive: true,
//     });

//     if (!box) {
//       return res.status(404).json({
//         message: "Box not found or not available",
//       });
//     }

//     if (await alreadySubscribed(userId, boxId)) {
//       return res.status(400).json({
//         message: "Already subscribed to this box",
//       });
//     }


//     // 2️⃣ Prevent seller subscribing to own box
//     const seller = await Seller.findOne({ userId });
//     if (seller && seller._id.equals(box.sellerId)) {
//       return res.status(400).json({
//         message: "You cannot subscribe to your own box",
//       });
//     }

//     const nextBillingDate = calculateNextBillingDate(box.billingCycle);


    


//     // 3️⃣ Create subscription
//     const subscription = await Subscription.create({
//       userId,
//       boxId,
//       titleSnapshot: box.title,
//       billingCycle: box.billingCycle,
//   priceSnapshot: box.price,
//   currency: box.currency,
//   nextBillingDate,
//     });

//     // 4️⃣ Update subscriber count
//     box.subscriberCount += 1;
//     await box.save();

//     return res.status(201).json({
//       message: "Subscribed successfully",
//       subscription,
//     });
//   } catch (error) {
//     // Duplicate subscription safeguard
//     if (error.code === 11000) {
//       return res.status(400).json({
//         message: "Already subscribed to this box",
//       });
//     }

//     console.error("Subscribe error:", error.message);
//     return res.status(500).json({
//       message: "Failed to subscribe",
//     });
//   }
// };
export const subscribeToBox = async (req, res) => {
  try {
    const userId = req.user._id;
    const { boxId } = req.params;

    const box = await Box.findOne({
      _id: boxId,
      isApproved: true,
      isActive: true,
    });

    if (!box) {
      return res.status(404).json({
        message: "Box not found or not available",
      });
    }

    if (await alreadySubscribed(userId, boxId)) {
      return res.status(400).json({
        message: "Already subscribed to this box",
      });
    }

    // 🚫 Seller cannot subscribe to own box
    const seller = await Seller.findOne({ userId });
    if (seller && seller._id.equals(box.sellerId)) {
      return res.status(400).json({
        message: "You cannot subscribe to your own box",
      });
    }

    const subscription = await Subscription.create({
      userId,
      sellerId: box.sellerId,
      boxId,
      titleSnapshot: box.title,
      billingCycle: box.billingCycle,
      priceSnapshot: box.price,
      currency: box.currency,
      nextBillingDate: calculateNextBillingDate(box.billingCycle),
    });

    box.subscriberCount += 1;
    await box.save();

    return res.status(201).json({
      message: "Subscribed successfully",
      subscription,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Already subscribed to this box",
      });
    }

    console.error("Subscribe error:", error);
    return res.status(500).json({
      message: "Failed to subscribe",
    });
  }
};



// export const getMySubscriptions = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const status = req.query.status; // optional: ACTIVE / CANCELLED

//     const filter = { userId };
//     if (status) {
//       filter.status = status;
//     }

//     const subscriptions = await Subscription.find(filter)
//       .populate({
//         path: "boxId",
//         select: "title price currency images billingCycle sellerId",
//         populate: {
//           path: "sellerId",
//           select: "brandName",
//         },
//       })
//       .sort({ createdAt: -1 });

//     return res.json({
//       count: subscriptions.length,
//       subscriptions,
//     });
//   } catch (error) {
//     console.error("Get subscriptions error:", error.message);
//     return res.status(500).json({
//       message: "Failed to fetch subscriptions",
//     });
//   }
// };

export const getMySubscriptions = async (req, res) => {
  try {
    const userId = req.user._id;

    const subscriptions = await Subscription.find({ userId })
      .select(
        "boxId titleSnapshot priceSnapshot billingCycle currency status nextBillingDate createdAt"
      )
      .populate({
        path: "boxId",
        select: "images sellerId isActive isApproved",
        populate: {
          path: "sellerId",
          select: "brandName",
        },
      })
      .sort({ createdAt: -1 });

    return res.json({
      count: subscriptions.length,
      subscriptions,
    });
  } catch (error) {
    console.error("Get subscriptions error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch subscriptions",
    });
  }
};

import mongoose from "mongoose";

export const getSubscriptionById = async (req, res) => {
  console.log("Get subscription by id called", req.params);
  try {
    const { subscriptionId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({
        message: "Invalid subscription ID",
      });
    }

    const subscription = await Subscription.findById(subscriptionId)
      .populate({
        path: "boxId",
        select: "title images sellerId isActive isApproved",
        populate: {
          path: "sellerId",
          select: "brandName",
        },
      });

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    if (!subscription.userId.equals(userId)) {
      return res.status(403).json({
        message: "Not authorized to view this subscription",
      });
    }

    return res.json({ subscription });

  } catch (error) {
    console.error("Get subscription by id error:", error);
    return res.status(500).json({
      message: "Failed to fetch subscription",
    });
  }
};

export const pauseSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({
        message: "Invalid subscription ID",
      });
    }

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    if (!subscription.userId.equals(userId)) {
      return res.status(403).json({
        message: "Not authorized to modify this subscription",
      });
    }

    if (subscription.status !== "ACTIVE") {
      return res.status(400).json({
        message: "Only active subscriptions can be paused",
      });
    }

    // Update only the fields we need without triggering full validation
    await Subscription.updateOne(
      { _id: subscriptionId },
      { 
        $set: { 
          status: "PAUSED",
          pausedAt: new Date()
        }
      }
    );

    const updatedSubscription = await Subscription.findById(subscriptionId);

    return res.json({
      message: "Subscription paused successfully",
      subscription: updatedSubscription,
    });

  } catch (error) {
    console.error("Pause subscription error:", error);
    return res.status(500).json({
      message: "Failed to pause subscription",
    });
  }
};

export const resumeSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({
        message: "Invalid subscription ID",
      });
    }

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    if (!subscription.userId.equals(userId)) {
      return res.status(403).json({
        message: "Not authorized to modify this subscription",
      });
    }

    if (subscription.status !== "PAUSED") {
      return res.status(400).json({
        message: "Only paused subscriptions can be resumed",
      });
    }

    // Recalculate next billing date
    const nextBillingDate = calculateNextBillingDate(subscription.billingCycle);

    // Update only the fields we need without triggering full validation
    await Subscription.updateOne(
      { _id: subscriptionId },
      { 
        $set: { 
          status: "ACTIVE",
          pausedAt: null,
          nextBillingDate: nextBillingDate,
          retryCount: 0
        }
      }
    );

    const updatedSubscription = await Subscription.findById(subscriptionId);

    return res.json({
      message: "Subscription resumed successfully",
      subscription: updatedSubscription,
    });

  } catch (error) {
    console.error("Resume subscription error:", error);
    return res.status(500).json({
      message: "Failed to resume subscription",
    });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({
        message: "Invalid subscription ID",
      });
    }

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    if (!subscription.userId.equals(userId)) {
      return res.status(403).json({
        message: "Not authorized to modify this subscription",
      });
    }

    if (subscription.status === "CANCELLED") {
      return res.status(400).json({
        message: "Subscription is already cancelled",
      });
    }

    // Update only the fields we need without triggering full validation
    await Subscription.updateOne(
      { _id: subscriptionId },
      { 
        $set: { 
          status: "CANCELLED",
          cancelledAt: new Date(),
          cancelReason: reason || "User requested cancellation"
        }
      }
    );

    // Update the box subscriber count
    if (subscription.boxId) {
      await Box.findByIdAndUpdate(subscription.boxId, {
        $inc: { subscriberCount: -1 }
      });
    }

    const updatedSubscription = await Subscription.findById(subscriptionId);

    return res.json({
      message: "Subscription cancelled successfully",
      subscription: updatedSubscription,
    });

  } catch (error) {
    console.error("Cancel subscription error:", error);
    return res.status(500).json({
      message: "Failed to cancel subscription",
    });
  }
};
