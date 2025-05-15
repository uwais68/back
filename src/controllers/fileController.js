import File from "../models/File.js"; // Import the File model
import fs from "fs";

// ✅ Upload File
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Create a new file document
    const fileData = new File({
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.userId, // Assuming user ID is available from JWT (use your middleware)
    });

    // Save file metadata to the database
    await fileData.save();

    res.status(200).json({
      message: "File uploaded successfully",
      file: fileData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Files
export const getFiles = async (req, res) => {
  try {
    // Get files uploaded by the authenticated user
    const files = await File.find({ uploadedBy: req.user.userId }); // Adjust the query based on the user

    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete File by ID
export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Find the file by ID
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: "File not found" });

    // Delete the file from the file system
    fs.unlinkSync(file.path);

    // Delete the file metadata from the database
    await File.findByIdAndDelete(fileId);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
