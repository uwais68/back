import mongoose from "mongoose";

const UserActivitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastSeen: { type: Date, default: Date.now },
    isTyping: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserActivity = mongoose.model("UserActivity", UserActivitySchema);
export default UserActivity;
