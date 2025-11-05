const express = require("express");
const router = express.Router();
const {
  general_post,
  get_all_general_posts,
  getgeneralPostsByUserId,
  delete_general_post,
  add_comment,
  get_comments,
  delete_comment,
  toggle_like,
  get_like_status,
  searchgenerals,
} = require("../controllers/postController");
const upload = require("../../middlewares/upload")


router.post("/post/create", upload.single("image"), general_post);
router.get("/post/get", get_all_general_posts);
router.get("/postGet/:userId", getgeneralPostsByUserId);
router.delete("/post/:id", delete_general_post);
router.get("/searchPost", searchgenerals);
//-------------like route----------------------------
router.post("/like/unlike", toggle_like);
router.get("/getlike", get_like_status);
//-------------------comments route -----------------
router.post("/comment", add_comment);
router.get("/:id/comments", get_comments);
router.delete("/comment/:id", delete_comment);



module.exports = router;