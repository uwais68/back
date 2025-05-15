import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit"; // ✅ Import rate limiter
import User from "../models/User.js"; // ✅ Import User model
import sendOTP from "../services/otpService.js";

const router = express.Router();

// ✅ Apply Rate Limiting for Login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 login attempts per window
  message: { error: "Too many login attempts. Please try again later." },
});

// ✅ REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({ firstName, lastName, email, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ LOGIN USER with Rate Limiting
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email)

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    // Verify password
    const isMatch = bcrypt.compare(password,user.password)
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    console.log(token)

    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ SEND OTP (Optional)
router.post("/generate-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    await user.save();

    // Send OTP via email
    await sendOTP(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ VERIFY OTP (Optional)
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // OTP verified, remove it from DB
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/me",async(req,res)=>{
  try {

    console.log('me')
    const data = jwt.decode(req.headers.authorization.split("Bearer ")[1])
    const user = await User.findById(data['userId'])
    if(!user) return res.status(401).json({ error: "Invalid email or password" });
else return res.status(200).json(user.toObject())
  } catch (error) {
    return res.status(401).json({ error: "Invalid email or password" });

    
  }
})

export default router; // ✅ Correct ES Module export
