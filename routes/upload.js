const uploadFile = require("../controllers/upload.js");
const express = require("express");
const router = express.Router();
const multer = require("multer");

// Multer configuration (Disk Storage)
const upload = multer({ dest: "uploads/" }); // Files temporarily stored in 'uploads' folder

router.post("/", upload.array("files", 10), uploadFile);

module.exports = router;

// this approach is when you dont use upload folder to store the file temporarily
// const uploadFile = require("../controllers/upload.js");
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// const upload = multer({ storage: multer.memoryStorage() });
// or use can write like this
// const storage = multer.memoryStorage(); // Store in memory instead of disk
// const upload = multer({ storage });

// router.post("/", upload.array("files"), uploadFile);

// module.exports = router;
