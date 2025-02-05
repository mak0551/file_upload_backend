const cloudinary = require("../config/cloudinary.js");
const fs = require("fs/promises"); // For cleaning up local files after upload

const uploadFile = async (req, res) => {
  // here we are giving multer as a middleware, Cloudinary's upload() method needs a file path, this path can be a diskstorage or a memorystorage with the help of multer we can provide both, below we have both approaches of uploading file with disk and with memory storage. what multer does is while using the diskstorage it automatically stores the file in the provided uploads/ folder and while uploading << await cloudinary.uploader.upload(file.path, {resource_type: "auto"}); >> here you can see file.path is given to the uploader.upload() method the file.path stores the path of the file i.e "uploads/filepath" which is given by multer middlewaare, so the cloudinary takes the file from the path and uploads it. dekh bhai apan multiple files upload karre samaj wo array mein jaati multer uploads folder k ander 1 by 1 store kardeta har ek file ku originalname, size and etc cheeza lage we rehte multer path b add kardeta har ek file ku example uploads/jfdfsjfsjdfs bol k har ek file ku dedeta phir wo array of files ku apan map kar k har ek file ku upload karare cloudinary k uploader method se uss mein file.path diye toh file ku location chalejati aur file upload hojati. now upload with memorystorage mein ye sob ki zarurat nai hai file memory mein store hoti aur memory me se leleta cloudinary bas uploader.uploadd_stream likhna rehta aur middleware me const upload = multer({ storage: multer.memoryStorage() }); likhna dist ki jagah
  try {
    const fileUploadPromises = req.files.map(async (file) => {
      console.log("File path:", file.path); // Check where Multer stored the file
      console.log("request", req.files);
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto", // Handles both images and videos
      });

      // Remove the local file after uploading to Cloudinary
      try {
        await fs.unlink(file.path); // Promises-based unlink
      } catch (err) {
        console.error(`Failed to delete file ${file.path}:`, err.message);
      }

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

module.exports = uploadFile;

// another approach this is direct approach without temporarily storing the file in uploads folder this is fast and efficient way the file is temporarily stored in the memory there is slight change in the code
// you just have to right const uploadStream = cloudinary.uploader.upload_stream()   the _stream extra to this line and dont need to give file.path it will automatically take the file from the memory

// const cloudinary = require("../config/cloudinary.js");

// const uploadFile = async (req, res) => {
//   try {
//     console.log(req.file);
//     const result = await new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         { resource_type: "auto" },
//         (error, result) => {
//           if (error) {
//             console.error("Cloudinary upload error:", error);
//             return reject(error);
//           }
//           resolve(result);
//         }
//       );
//       console.log("Uploading file buffer...");
//       uploadStream.end(req.file.buffer); // Upload directly from memory
//     });
//     console.log("Upload successful:", result.secure_url);
//     res.status(200).json({ secure_url: result.secure_url });
//   } catch (error) {
//     res.status(500).json({ message: "Upload failed", error: error.message });
//   }
// };

// module.exports = uploadFile;
