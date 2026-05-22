import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
console.log("razorpay connected",process.env.RAZORPAY_KEY_ID);
console.log("KEY_SECRET length:", process.env.RAZORPAY_KEY_SECRET?.length);
const razorpay=new Razorpay({
    
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
    
});


export default razorpay;