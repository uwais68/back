import express from "express";
import upload from "../middleware/upload.js"; // Import the updated file upload middleware
import { uploadFile, getFiles, deleteFile } from "../controllers/fileController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Import the authMiddleware

const router = express.Router();

// Route to upload a single file (protected by authMiddleware)
router.post("/upload", authMiddleware, upload.single("file"), uploadFile); // "file" is the name of the field in the form

// Route to get all uploaded files for the authenticated user (protected by authMiddleware)
router.get("/files", authMiddleware, getFiles);

// Route to delete a file by its ID (protected by authMiddleware)
router.delete("/files/:fileId", authMiddleware, deleteFile);

export default router;
