import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit"; // ✅ Import rate limiter
//import //redisClient from "../config///redisClient.js"; // ✅ Import Redis client
import { createTask, getTasks, updateTask, deleteTask, getAllTask } from "../controllers/taskController.js";

const router = express.Router();

// ✅ Rate Limiting for Task Creation (Max 5 requests per minute)
const taskCreationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per minute
  message: { error: "Too many task creation attempts, please try again later." }
});

// ✅ Rate Limiting for Updates/Deletions (Max 10 requests per minute)
const taskModificationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  message: { error: "Too many requests. Please slow down." }
});

// ✅ Get All Tasks (with Redis caching)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    //redisClient.get("tasks", async (err, cachedTasks) => {
      // if (cachedTasks) {
      //   console.log("✅ Serving tasks from cache");
      //   return res.json(JSON.parse(cachedTasks)); // Return cached data
      // }

      // If not cached, fetch from database
      const tasks = await getTasks(req, res);

      // Store fetched tasks in Redis with expiry time (1 hour)
      //redisClient.setex("tasks", 3600, JSON.stringify(tasks));

      console.log("✅ Serving tasks from database");
    // });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Routes with rate limiting
router.post("/create", authMiddleware, taskCreationLimiter, async (req, res) => {
  await createTask(req, res);
  //redisClient.del("tasks"); // ✅ Clear cache after creating a task
});

router.put("/update/:taskId", authMiddleware, taskModificationLimiter, async (req, res) => {
  await updateTask(req, res);
  //redisClient.del("tasks"); // ✅ Clear cache after updating a task
});

router.delete("/delete/:taskId", authMiddleware, taskModificationLimiter, async (req, res) => {
  await deleteTask(req, res);
  //redisClient.del("tasks"); // ✅ Clear cache after deleting a task
});
router.get("/all",authMiddleware,async(req,res)=>{
 console.log("data")
  await getAllTask(req,res)
})

export default router;
