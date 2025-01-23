const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs"); // For cleaning up local files after upload
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());

// Multer configuration (Disk Storage)
const upload = multer({ dest: "uploads/" }); // Files temporarily stored in 'uploads' folder

// Route to handle file upload
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path; // Path of the uploaded file
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // Handles both images and videos
    });
    console.log(result);

    // Remove the local file after uploading to Cloudinary
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: "Upload successful!",
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

const PORT = process.env.PORT || 500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
