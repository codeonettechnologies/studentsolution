const express = require("express");
const multer = require("multer");
const { register , login } = require("./auth");
 
const router = express.Router();
 
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
 
 
router.post("/register", upload.single("profile_image"), register);
 
router.post("/login", login);
 
module.exports = router;