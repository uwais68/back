import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendMessage, getMessages, markAsRead, updateTypingStatus, getLastSeen ,createDM} from "../controllers/chatcontroller.js";

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/:chatRoom/messages", authMiddleware, getMessages);
router.put("/mark-as-read", authMiddleware, markAsRead);
router.put("/typing-status", authMiddleware, updateTypingStatus);
router.get("/:userId/last-seen", authMiddleware, getLastSeen);
router.post("/dm", authMiddleware, createDM);

export default router;
