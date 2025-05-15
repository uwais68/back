import Message from "../models/message.js";
import ChatRoom from "../models/chatRoom.js";

// ✅ Send a Message (Text, File, Image, Voice, or Reply)
export const sendMessage = async (req, res) => {
  try {
    const { chatRoom, content, messageType, fileUrl, replyTo } = req.body;
    const sender = req.user.userId; // Extracted from JWT

    // Validate message type
    if (!["text", "image", "file", "voice"].includes(messageType)) {
      return res.status(400).json({ error: "Invalid message type." });
    }

    // Ensure the chat room exists
    const roomExists = await ChatRoom.findById(chatRoom);
    if (!roomExists) return res.status(404).json({ error: "Chat room not found." });

    // Create the message
    const newMessage = new Message({
      chatRoom,
      sender,
      content,
      messageType,
      fileUrl,
      replyTo, // If it's a reply
      status: "sent",
    });

    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Messages from a Chat Room
export const getMessages = async (req, res) => {
  try {
    const { chatRoom } = req.params;

    const messages = await Message.find({ chatRoom })
      .populate("sender", "firstName lastName email")
      .populate("replyTo", "content sender messageType")
      .sort({ createdAt: 1 }); // Sort oldest to newest

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Soft Delete a Message for a User
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found." });

    // Add user to the deletedFor array (soft delete)
    if (!message.deletedFor.includes(userId)) {
      message.deletedFor.push(userId);
      await message.save();
    }

    res.json({ message: "Message deleted for this user." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Message Status (Delivered/Read)
export const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body; // "delivered" or "read"

    if (!["delivered", "read"].includes(status)) {
      return res.status(400).json({ error: "Invalid status update." });
    }

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found." });

    message.status = status;
    await message.save();

    res.json({ message: "Message status updated.", updatedMessage: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ React to a Message (Add or Remove Emoji)
export const reactToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.userId;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found." });

    // Check if the user already reacted with the same emoji
    const existingReaction = message.reactions.find(
      (reaction) => reaction.user.toString() === userId && reaction.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction if it already exists
      message.reactions = message.reactions.filter(
        (reaction) => !(reaction.user.toString() === userId && reaction.emoji === emoji)
      );
    } else {
      // Add new reaction
      message.reactions.push({ user: userId, emoji });
    }

    await message.save();
    res.json({ message: "Reaction updated.", updatedMessage: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Reply to a Message (Threaded Messages)
export const replyToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content, messageType, fileUrl } = req.body;
    const sender = req.user.userId;

    if (!["text", "image", "file", "voice"].includes(messageType)) {
      return res.status(400).json({ error: "Invalid message type." });
    }

    const parentMessage = await Message.findById(messageId);
    if (!parentMessage) return res.status(404).json({ error: "Original message not found." });

    const replyMessage = new Message({
      chatRoom: parentMessage.chatRoom,
      sender,
      content,
      messageType,
      fileUrl,
      replyTo: messageId, // Link reply to the original message
      status: "sent",
    });

    await replyMessage.save();
    res.status(201).json({ message: "Reply sent successfully", replyMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
