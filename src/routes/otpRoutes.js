// src/routes/otpRoutes.js
import express from "express";
import rateLimit from "express-rate-limit";
import { generateOTP, verifyOTP } from "../controllers/otpController.js";

const router = express.Router();

// ✅ Rate limiter for OTP requests (limits to 3 requests per 10 minutes)
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // Limit each IP to 3 OTP requests per window
  message: { error: "Too many OTP requests. Please try again later." },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the X-RateLimit headers
});

// ✅ Route to generate OTP with rate limiter
router.post("/generate", otpLimiter, generateOTP);

// ✅ Route to verify OTP (no rate limiting on verification)
router.post("/verify", verifyOTP);

export default router;

