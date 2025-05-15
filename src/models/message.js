import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String },
    messageType: { type: String, enum: ["text", "image", "file", "voice"], required: true },
    fileUrl: { type: String }, // For images, files, or voice notes
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Replies
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        emoji: { type: String },
      },
    ],
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Soft delete
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;
