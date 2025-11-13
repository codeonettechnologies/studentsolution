const express = require("express");
const {
  addCollege,
  getColleges,
  deleteCollege,
  addAd,
  getAds,
  updateAd,
  deleteAd,
  addCity,
   getCity,
   deleteCity,
   addProfessions,
   getProfessions,
   deleteProfessions
} = require("../adminController/postController");

const upload = require("../../middlewares/upload");
const router = express.Router();

router.post("/addCity", addCity);
router.get("/getAllCity", getCity);
router.delete("/deleteCity/:id", deleteCity);

router.post("/addCollege", addCollege);
router.get("/getAllCollege", getColleges);
router.delete("/deleteClg/:id", deleteCollege);

router.post("/addProfessions", addProfessions);
router.get("/getAllProfessions", getProfessions);
router.delete("/deleteProfessions/:id", deleteProfessions);

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
router.delete("/deleteAds/:id", deleteAd);


module.exports = router;
