import multer from "multer";

// Set up storage options for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set destination folder for file uploads
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    // Create a unique filename using the original filename and a timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to allow only certain types of files (optional)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type"), false); // Reject the file
  }
};

// Create Multer instance with options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

export default upload;
