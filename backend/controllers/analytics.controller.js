import Box from "../models/box.model.js";
import Subscription from "../models/subscription.model.js";
import mongoose from "mongoose";

export const getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // 1️⃣ KPI Aggregation
    const kpis = await Subscription.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          status: "ACTIVE",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalSubscribers: { $sum: 1 },
        },
      },
    ]);

    // 2️⃣ Monthly Revenue Trend
    const revenueTrend = await Subscription.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          status: "ACTIVE",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // 3️⃣ Top Performing Boxes
    const topBoxes = await Subscription.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
        },
      },
      {
        $group: {
          _id: "$boxId",
          revenue: { $sum: "$amount" },
          subscribers: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "boxes",
          localField: "_id",
          foreignField: "_id",
          as: "box",
        },
      },
      { $unwind: "$box" },
    ]);

    res.json({
      totalRevenue: kpis[0]?.totalRevenue || 0,
      totalSubscribers: kpis[0]?.totalSubscribers || 0,
      revenueTrend,
      topBoxes,
    });
  } catch (error) {
    console.error("Seller analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
