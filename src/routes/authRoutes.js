import express from "express"; 
import rateLimit from "express-rate-limit"; // ✅ Import rate limiter
import router  from "../controllers/authController.js";
 
// ✅ Rate limiter to prevent brute-force attacks (5 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per window per IP
  message: { error: "Too many login attempts, please try again later." },
  headers: true,
});
export default router;
