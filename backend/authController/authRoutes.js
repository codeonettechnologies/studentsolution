const express = require("express");
const multer = require("multer");
const { register , login ,getAllUsers , logout } = require("./auth");
 
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
router.get("/getAllUser" , getAllUsers)
router.post("/logOut" , logout) 
module.exports = router;