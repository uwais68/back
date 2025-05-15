import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { 
  sendMessage, 
  getMessages, 
  deleteMessage, 
  updateMessageStatus, 
  reactToMessage,
  replyToMessage
} from "../controllers/messageController.js";

const router = express.Router();

// ✅ Route to send a message (Supports text, files, images, voice notes)
router.post("/send", authMiddleware, sendMessage);

// ✅ Route to get all messages from a specific chat room
router.get("/:chatRoom", authMiddleware, getMessages);

// ✅ Route to delete (soft delete) a message for a user
router.delete("/:messageId", authMiddleware, deleteMessage);

// ✅ Route to update message status (sent -> delivered -> read)
router.put("/:messageId/status", authMiddleware, updateMessageStatus);

// ✅ Route to react to a message (Add/remove emoji reactions)
router.post("/:messageId/react", authMiddleware, reactToMessage);

// ✅ Route to reply to a specific message
router.post("/:messageId/reply", authMiddleware, replyToMessage);

export default router;
