import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {updateProfile,getusers,getuserByID}  from "../controllers/userController.js";

const userRoutes = express.Router();

// ✅ Route for Updating User Profile
userRoutes.put("/update-profile", authMiddleware, updateProfile);
userRoutes.get("/all",authMiddleware,getusers)
userRoutes.get("/:id",authMiddleware,getuserByID)

export default userRoutes;
