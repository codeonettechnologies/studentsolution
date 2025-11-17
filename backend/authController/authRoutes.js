const express = require("express");
const multer = require("multer");
const { register , login ,getAllUsers , logout  , viewProfile, updateProfile} = require("./auth");
 
const router = express.Router();
 
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
 
 
router.post("/register", upload.single("profile_image"), register);
router.put("/profile-image/:id", upload.single("profile_image"), updateProfile);
router.post("/login", login);
router.get("/getAllUser" , getAllUsers)
router.post("/logOut" , logout) 
router.get("/profile/:id" , viewProfile)
module.exports = router;