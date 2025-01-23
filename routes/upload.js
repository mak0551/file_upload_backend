const express = require("express");
const uploadFIle = require("../controllers/upload.js");
const multer = require("multer");
const router = express.Router();

// Multer configuration (Disk Storage)
const upload = multer({ dest: "uploads/" }); // Files temporarily stored in 'uploads' folder

router.post("/", upload.array('files', 10), uploadFIle);

module.exports = router;
