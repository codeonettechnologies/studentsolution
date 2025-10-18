const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/upload");

const {
  tifin_post,
  get_all_tifin_posts,
  getTifinPostsByUserId,
  delete_tifin_post,
  post_comment,
  get_comments,
  delete_comment,
  toggle_like,
  get_like_status
} = require("../../tifin/controllers/tifinPostController");

//-----------------Tifin router-------------------------------------------------
router.post("/post/create", upload.single("image"), tifin_post);
router.get("/post/get", get_all_tifin_posts);
router.get("/postGet/:userId", getTifinPostsByUserId);
router.delete("/post/:id", delete_tifin_post);

//-------------------comments route -----------------
 
router.post("/comment", post_comment);
router.get("/:id/comments", get_comments);
router.delete("/comment/:id", delete_comment);

//-------------like route----------------------------
router.post("/like/unlike", toggle_like);
router.get("/getlike", get_like_status);

module.exports = router;
