import Notification from "../models/Notification.js";

// ✅ Create Notification
export const createNotification = async (req, res) => {
  try {
    const { user, sender, message, type, relatedId } = req.body;

    if (!user || !message || !type) {
      return res.status(400).json({ error: "User, message, and type are required." });
    }

    const newNotification = new Notification({
      user, // Receiver of the notification
      sender, // Optional: who triggered it
      message,
      type,
      relatedId, // Optional: ID of task, chat, or file
    });

    await newNotification.save();
    res.status(201).json({ message: "Notification created successfully", notification: newNotification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Notifications for a User
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId; // Get user from token (authMiddleware required)
    
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    
  return    res.json(notifications ??[] );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Mark Notification as Read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);
    
    if (!notification) return res.status(404).json({ error: "Notification not found" });

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) return res.status(404).json({ error: "Notification not found" });

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
