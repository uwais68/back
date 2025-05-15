import express from "express";
import authMiddleware from   "../middleware/authMiddleware.js"; // ✅ Ensure .js extension

const protectedRoutes = express.Router();

// Protected route for the dashboard
protectedRoutes.get("/dashboard", authMiddleware, (req, res) => {
  
  res.json({ message: "Welcome to the dashboard!", user: req.user });
});

// ✅ Protected Route (Example: User Profile)
protectedRoutes.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to your profile", user: req.user });
});

export default protectedRoutes; // ✅ Use ES6 export
