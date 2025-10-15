const express = require("express");
const router = express.Router();
const {
  createPost,
  getPost,
  getPostsByUserId,
  deletePost,
  toggle_like,
  addComment,
  getComment,
  deleteComment,
  get_like_status,
} = require("./controllers/coachingControllers");

const upload = require("../../middlewares/upload");

// -------------------- Coaching Posts --------------------

// POST - Create coaching post
router.post("/post/create", upload.single("image"), createPost);
router.get("/post/get", getPost);
router.get("/post/:id", getPostsByUserId);
router.delete("/post/:id", deletePost);

// -------------------- Likes --------------------

router.post("/like/unlike", toggle_like);
router.get("/getlike", get_like_status);
// -------------------- Comments --------------------

// Add new comment
router.post("/comment", addComment);
router.get("/:id/comments", getComment);
router.delete("/comment/:id", deleteComment);

module.exports = router;
