const cloudinary = require("../config/cloudinary.js");
const fs = require("fs"); // For cleaning up local files after upload

const uploadFIle = async (req, res) => {
  try {
    const fileUploadPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto", // Handles both images and videos
      });

      // Remove the local file after uploading to Cloudinary
      fs.unlinkSync(file.path);

      return result.secure_url; // Return the Cloudinary URL
    });

    // Wait for all uploads to complete
    const uploadedUrls = await Promise.all(fileUploadPromises);

    res.status(200).json({
      message: "Files uploaded successfully!",
      urls: uploadedUrls, // Return all uploaded file URLs
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

module.exports = uploadFIle;
