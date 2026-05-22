import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import boxRoutes from "./routes/box.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import "./cron/monthlyLimit.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.route.js";
import  webhookRoutes from "./routes/webhook.routes.js";
import "./cron/subscription.js";
// import cronRoutes from "./routes/cron.routes.js";
import "./cron/monthlyLimit.js";
import "./cron/autoCancelUnshippedOrders.js";


dotenv.config(); // ✅ Load environment variables
console.log("firebase connected");

const app = express();

app.use("/webhook",express.raw({ type: "application/json" }), webhookRoutes);

app.use(express.json());
app.use(cors({
      origin:"https://boxdrop-frontend.onrender.com",
      credentials:true
}));
app.use("/users", userRoutes);
app.use("/sellers", sellerRoutes);
app.use("/boxes", boxRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/upload", uploadRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
// app.use("/api/cron", cronRoutes);


const PORT = process.env.PORT || 4000 ;

// ✅ Connect to MongoDB
const start=async()=>{
   
     const mongodb=await mongoose.connect(process.env.MONGO_URI)
     console.log("mongodb is connected")
 app.listen(PORT,'0.0.0.0',()=>{
    console.log(`everything is fine ✅ server is running on port ${PORT}`)
 })

}
start();



