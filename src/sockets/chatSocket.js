import { Server } from "socket.io";
import Message from "./models/message.js";
import ChatRoom from "./models/chatRoom.js";

const onlineUsers = new Map(); // Track online users

const configureSockets = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle User Joining a Chat Room
    socket.on("joinRoom", ({ chatRoomId, userId }) => {
      socket.join(chatRoomId);
      onlineUsers.set(userId, socket.id); // Store user's socket ID
      console.log(`User ${userId} joined room: ${chatRoomId}`);
    });

    // Handle Sending a New Message
    socket.on("sendMessage", async ({ chatRoom, sender, content, messageType }) => {
      try {
        const message = new Message({ chatRoom, sender, content, messageType });
        await message.save();
        await ChatRoom.findByIdAndUpdate(chatRoom, { lastMessage: message._id });

        // Emit message only to users in the chatRoom
        io.to(chatRoom).emit("newMessage", message);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Handle Typing Indicator
    socket.on("typing", ({ chatRoom, sender, isTyping }) => {
      // Broadcast typing status only to users in the same chatRoom
      io.to(chatRoom).emit("typingStatus", { chatRoom, sender, isTyping });
    });

    // Handle Disconnecting User
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId); // Remove user from online tracking
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};

export default configureSockets;
