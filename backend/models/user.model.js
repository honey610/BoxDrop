import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // MongoDB automatically creates _id → use this as userId
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    
    email: {
      type: String,
      required: true,
      index: true,
    },
   
    name: String,
    role: {
      type: String,
      enum: ["USER", "SELLER", "ADMIN"],
      default: "USER",
    },
    interests: [String],
  },
  { timestamps: true }
);

// Optional virtual (if you want userId explicitly)
userSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export default mongoose.model("User", userSchema);
