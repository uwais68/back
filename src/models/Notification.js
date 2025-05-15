import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Receiver of notification
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional sender (who triggered the notification)
    message: { type: String, required: true }, // Notification message
    type: { 
      type: String, 
      enum: ["task", "chat", "file", "general"], 
      required: true 
    }, // Type of notification
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // ID of related entity (taskId, chatId, etc.)
    isRead: { type: Boolean, default: false }, // Read status
    createdAt: { type: Date, default: Date.now } // Timestamp
  }
);

export default mongoose.model("Notification", notificationSchema);
