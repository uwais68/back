import express from "express";
import { createTimeLog, getTimeLogs } from "../controllers/TimeLogController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // To ensure the user is authenticated

const router = express.Router();

// ✅ Create a Time Log
router.post("/create", authMiddleware, createTimeLog);

// ✅ Get Time Logs for a specific Task
router.get("/:taskId", authMiddleware, getTimeLogs);

export default router;
