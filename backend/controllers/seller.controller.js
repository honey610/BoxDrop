import Seller from "../models/seller.model.js";
// import {User} from "../models/user.model.js";
import User from "../models/user.model.js";
import Order from "../models/orders.model.js";
import Box from "../models/box.model.js";
import Subscription from "../models/subscription.model.js";


export const applyForSeller = async (req, res) => {
    try{
       const userId = req.user._id;

    // ❌ Already a seller?
    const existingSeller = await Seller.findOne({ userId });

    if (existingSeller) {
      return res.status(400).json({
        message: "You have already applied or are already a seller",
      });
    }
    const { brandName, description } = req.body;

    if (!brandName) {
      return res.status(400).json({
        message: "Brand name is required",
      });
    }

    // Create seller application
    const seller = await Seller.create({
      userId,
      brandName,
      description,
      status: "PENDING",
      isApproved: false,
    });

    return res.status(201).json({
      message: "Seller application submitted successfully",
      seller,
    });

    }catch (error) {
        console.error("Error in applyForSeller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const reApplyForSeller = async (req, res) => {
  try {
    const userId = req.user._id;
    const { brandName, description } = req.body;

    if (!brandName || !description) {
      return res.status(400).json({
        message: "Brand name and description are required",
      });
    }

    const existingSeller = await Seller.findOne({ userId });

    // 🚫 Auto-block after X rejections
    if (existingSeller?.isBlocked) {
      return res.status(403).json({
        message:
          "Your seller account is blocked due to multiple rejections. Contact support.",
      });
    }

    // ♻️ Re-apply only if previously rejected
    if (existingSeller && existingSeller.status !== "REJECTED") {
      return res.status(400).json({
        message: "You cannot re-apply at this stage",
      });
    }

    // 🔁 Reset seller application
    if (existingSeller) {
      existingSeller.brandName = brandName;
      existingSeller.description = description;
      existingSeller.status = "PENDING";
      existingSeller.rejectionReason = null;
      existingSeller.rejectedAt = null;

      await existingSeller.save();

      return res.json({
        message: "Seller application re-submitted successfully",
        seller: existingSeller,
      });
    }

    // 🆕 First-time apply fallback
    const seller = await Seller.create({
      userId,
      brandName,
      description,
      status: "PENDING",
    });

    return res.json({
      message: "Seller application submitted successfully",
      seller,
    });
  } catch (error) {
    console.error("Re-apply for seller error:", error.message);
    return res.status(500).json({
      message: "Failed to re-apply for seller",
    });
  }
};



export const approveSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    if (seller.status === "APPROVED") {
      return res.status(400).json({
        message: "Seller already approved",
      });
    }

    // Approve seller
    seller.status = "APPROVED";
    seller.isApproved = true;

    seller.approvedAt = new Date();
    seller.approvedBy = req.user._id;
    seller.rejectionCount = 0;
    seller.isBlocked = false;
    seller.blockedAt = null;
    seller.blockReason = null;


    await seller.save();

    // // Upgrade user role to SELLER
    // await User.findByIdAndUpdate(seller.userId, {
    //   role: "SELLER",
    // });
    // Upgrade user role safely
const user = await User.findById(seller.userId);

if (user.role !== "ADMIN") {
  user.role = "SELLER";
  await user.save();
}


    return res.json({
      message: "Seller approved successfully",
      seller,
    });
  } catch (error) {
    console.error("Approve seller error:", error.message);
    return res.status(500).json({
      message: "Failed to approve seller",
    });
  }
};

export const getStatusPendingSellers = async (req, res) => {
  try {
    // 🔐 Admin-only check
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // 📦 Fetch pending sellers + user info
    const pendingSellers = await Seller.find({ status: "PENDING" })
      .populate("userId", "email name")
      .sort({ createdAt: -1 });

    return res.json({
      message: "Pending sellers fetched successfully",
      sellers: pendingSellers,
      // count: pendingSellers.length,
    });
  } catch (error) {
    console.error("Get pending sellers error:", error.message);
    return res.status(500).json({
      message: "Failed to get pending sellers",
    });
  }
};

export const rejectSeller = async (req, res) => {
  try {
    // 🔐 Double safety: admin-only
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const { sellerId } = req.params;
    const { reason } = req.body; // optional

    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    if (seller.status === "REJECTED") {
      return res.status(400).json({
        message: "Seller already rejected",
      });
    }

    if (seller.status === "APPROVED") {
      return res.status(400).json({
        message: "Approved seller cannot be rejected",
      });
    }

    seller.status = "REJECTED";
    seller.isApproved = false;
    seller.rejectedAt = new Date();
    seller.rejectedBy = req.user._id;
    seller.rejectionReason = reason || "Not specified";
    seller.rejectionCount += 1;
       if (seller.rejectionCount >= 3) {
      seller.isBlocked = true;
      seller.blockedAt = new Date();
      seller.blockReason =
        "Seller application rejected multiple times";
    }



    await seller.save();

    return res.json({
      message: "Seller rejected successfully",
      seller,
    });
  } catch (error) {
    console.error("Reject seller error:", error.message);
    return res.status(500).json({
      message: "Failed to reject seller",
    });
  }
};



export const getMySellerStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Find seller profile
    const seller = await Seller.findOne({ userId });

    // 2️⃣ If never applied
    if (!seller) {
      return res.json({
        status: "NONE",
      });
    }

    // 3️⃣ Return seller status
    return res.json({
      status: seller.status, // PENDING | APPROVED | REJECTED
      rejectionReason: seller.rejectionReason || null,
      isBlocked: seller.isBlocked,
      blockReason: seller.blockReason || null,
      rejectionCount: seller.rejectionCount,
    });
  } catch (error) {
    console.error("Get my seller status error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch seller status",
    });
  }
};

export const getTotalSellersCount = async (req, res) => {
  try {
    

    const totalSellers = await Seller.countDocuments({ isApproved: true });

    return res.json({
      message: "Total sellers count fetched successfully",
      totalSellers,
    });
  } catch (error) {
    console.error("Get total sellers count error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch total sellers count",
    });
  }
};

export const getTotalSubscribersforSeller = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Find seller
    const seller = await Seller.findOne({ userId, isApproved: true });

    if (!seller) {
      return res.status(403).json({
        message: "You are not an approved seller",
      });
    }

    // 2️⃣ Fetch delivered orders for this seller
    const orders = await Order.find({
      sellerId: seller._id,
      status: "DELIVERED",
    }).populate("userId", "name email");

    // 3️⃣ Remove duplicate users
    const uniqueSubscribersMap = new Map();

    orders.forEach(order => {
      uniqueSubscribersMap.set(
        order.userId._id.toString(),
        order.userId
      );
    });

    const subscribers = Array.from(uniqueSubscribersMap.values());

    return res.json({
      totalSubscribers: subscribers.length,
      subscribers,
    });

  } catch (error) {
    console.error("Get subscribers for seller error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch subscribers for seller",
    });
  }
};


export const getTotalLiveBoxesforSeller = async (req, res) => {
  try {
    const userId = req.user._id;
    // 1️⃣ Find seller
    const seller = await Seller.findOne({ userId, isApproved: true });

    if (!seller) {
      return res.status(403).json({
        message: "You are not an approved seller",
      });
    }

    const liveBoxesCount = await Box.countDocuments({
      sellerId: seller._id,
      isApproved: true,
    });

    return res.json({
      totalLiveBoxes: liveBoxesCount,
    });
  } catch (error) {
    console.error("Get live boxes for seller error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch live boxes for seller",
    });
  }
}

export const calculateSellerRevenue = async (req, res) => {
  try{
    const userId = req.user._id;
    

    // 1️⃣ Find seller
    const seller = await Seller.findOne({ userId, isApproved: true });

    if (!seller) {
      return res.status(403).json({
        message: "You are not an approved seller",
      });
    }

    // 2️⃣ Fetch delivered orders for this seller
    const orders=await Order.find({
      sellerId: seller._id,
      status: "DELIVERED",
    }).populate("boxId", "price");
    // 3️⃣ Calculate total revenue
    let totalRevenue=0;
    orders.forEach(order=>{
      totalRevenue+=order.quantity*order.boxId.price;
    });
    return res.json({
      totalRevenue,
    });


  }catch(error){
    console.error("Calculate seller revenue error:", error.message);
    return res.status(500).json({
      message: "Failed to calculate seller revenue",
    });
  }
}



export const getSellerBoxPerformance = async (req, res) => {
 try {
    const userId = req.user._id;

    const seller = await Seller.findOne({ userId, isApproved: true });
    if (!seller) {
      return res.status(403).json({ message: "Not an approved seller" });
    }

    const performance = await Order.aggregate([
      {
        $match: {
          sellerId: seller._id,
          status: "DELIVERED",
        },
      },
      {
        $group: {
          _id: "$boxId",
          totalOrders: { $sum: 1 },
          revenue: { $sum: { $multiply: ["$quantity", "$priceSnapshot"] } },
          users: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          boxId: "$_id",
          subscribers: { $size: "$users" }, // 👈 people who ordered
          revenue: 1,
          _id: 0,
        },
      },
      {
        $lookup: {
          from: "boxes",
          localField: "boxId",
          foreignField: "_id",
          as: "box",
        },
      },
      { $unwind: "$box" },
      {
        $project: {
          title: "$box.title",
          status: "$box.isApproved",
          subscribers: 1,
          revenue: 1,
        },
      },
      {
        $sort: { revenue: -1 },
      },
    ]);

    return res.json({ performance });
  } catch (error) {
    console.error("Get seller box performance error:", error.message);
    return res .status(500).json({
      message: "Failed to fetch box performance data",
    });
  }
}

export const calcSellerTrustScore = async (req, res) => {
  try {
    const userId = req.user._id;

    const seller = await Seller.findOne({ userId, isApproved: true });
    if (!seller) {
      return res.status(403).json({ message: "Not an approved seller" });
    }
    const totalOrders = await Order.countDocuments({
      sellerId: seller._id,
    });

    const deliveredOrders = await Order.countDocuments({
      sellerId: seller._id,
      status: "DELIVERED",
    });

    const trustScore =
      totalOrders === 0
        ? 100 // new sellers start neutral
        : Math.round((deliveredOrders / totalOrders) * 100);

    return res.json({
      trustScore,
      deliveredOrders,
      totalOrders,
    });
  }catch (error) {
    console.error("Calculate seller trust score error:", error.message);
    return res.status(500).json({
      message: "Failed to calculate seller trust score",
    });
  }

}

export const getSellerRevenueTrend = async (req, res) => {
  try {
    const userId = req.user._id;

    const seller = await Seller.findOne({ userId, isApproved: true });
    if (!seller) {
      return res.status(403).json({ message: "Not an approved seller" });
    }

    const trend = await Order.aggregate([
      {
        $match: {
          sellerId: seller._id,
          status: "DELIVERED",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: {
            $sum: { $multiply: ["$quantity", "$priceSnapshot"] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const formatted = trend.map((item) => ({
      label: `${item._id.month}/${item._id.year}`,
      revenue: item.revenue,
    }));

    return res.json({ trend: formatted });
  } catch (error) {
    console.error("Revenue trend error:", error.message);
    return res.status(500).json({ message: "Failed to fetch revenue trend" });
  }
};


export const getSellerSubscriptions = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Find approved seller
    const seller = await Seller.findOne({ userId, isApproved: true });
    if (!seller) {
      return res.status(403).json({
        message: "You are not an approved seller",
      });
    }

    // 2️⃣ Get seller's boxes
    const boxes = await Box.find(
      { sellerId: seller._id },
      "_id title"
    );

    const boxIds = boxes.map((box) => box._id);

    // 3️⃣ Fetch subscriptions for seller's boxes
    const subscriptions = await Subscription.find({
      boxId: { $in: boxIds },
      priceSnapshot: { $gt: 0 }, // only paid subscriptions
    })
      .populate("userId", "name email")
      .populate("boxId", "title images billingCycle");

    return res.json({
      count: subscriptions.length,
      subscriptions,
    });
  } catch (error) {
    console.error("Get seller subscriptions error:", error);
    return res.status(500).json({
      message: "Failed to fetch seller subscriptions",
    });
  }
};
