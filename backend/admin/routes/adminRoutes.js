const express = require("express");
const {
  addCollege,
  getColleges,
  addAd,
  getAds,
  updateAd
} = require("../adminController/postController");

const upload = require("../../middlewares/upload");
const router = express.Router();

router.post("/add", addCollege);
router.get("/getAll", getColleges);

// ✅ allow both image & video fields
router.post(
  "/addAd",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  addAd
);

router.get("/all", getAds);
router.put("/update/:id", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]), updateAd);

module.exports = router;
