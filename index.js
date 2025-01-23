const express = require("express");
const app = express();
const cors = require("cors");
const uploadFile = require("./routes/upload.js");

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use("/upload", uploadFile);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
