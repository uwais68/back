import express from "express";
import { createMilestone, getMilestones, markMilestoneAchieved } from "../controllers/milestoneController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // To ensure the user is authenticated

const router = express.Router();

// ✅ Create a Milestone
router.post("/create", authMiddleware, createMilestone);

// ✅ Get Milestones for a specific Task
router.get("/:taskId", authMiddleware, getMilestones);

// ✅ Mark a Milestone as Achieved
router.put("/:milestoneId/achieved", authMiddleware, markMilestoneAchieved);

export default router;
