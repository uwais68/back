// src/controllers/otpController.js
import OTP from "../models/otpModels.js";
import sendOTP from "../services/otpService.js"; // Make sure this points to the correct service

// Generate OTP and send it to the user's email
export const generateOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    const otpRecord = new OTP({ email, otp, expiresAt });
    await otpRecord.save();

    await sendOTP(email, otp); // Send the OTP to the user's email

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(404).json({ error: "OTP not found" });
    }

    if (otpRecord.isVerified) {
      return res.status(400).json({ error: "OTP already verified" });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    if (otp !== otpRecord.otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
