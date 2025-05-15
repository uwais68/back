import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // If Group
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // For fast access
  },
  { timestamps: true }
);

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
export default ChatRoom;
