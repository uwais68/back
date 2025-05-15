import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createNotification, getNotifications, markAsRead, deleteNotification } from "../controllers/notificationController.js";

const router = express.Router();

// ✅ Create a new notification (only admins or system can trigger this)
router.post("/create", authMiddleware, createNotification);

// ✅ Get all notifications for a user
router.get("/my", authMiddleware, getNotifications);

// ✅ Mark a notification as read
router.put("/mark-as-read/:notificationId", authMiddleware, markAsRead);

// ✅ Delete a notification
router.delete("/delete/:notificationId", authMiddleware, deleteNotification);

export default router;
