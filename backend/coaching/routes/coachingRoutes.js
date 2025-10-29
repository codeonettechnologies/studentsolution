const express = require("express");
const router = express.Router();
const {
  createPost,
  getPost,
  getCoachingPostsByUserId,
  deletePost,
  searchCoachings,
  toggle_like,
  addComment,
  getComment,
  deleteComment,
  get_like_status,
} = require("./controllers/coachingControllers");

const upload = require("../../middlewares/upload");

// -------------------- Coaching Posts --------------------

router.post("/post/create", upload.single("image"), createPost);
router.get("/post/get", getPost);
router.get('/postGet/:userId', getCoachingPostsByUserId);
router.delete("/post/:id", deletePost);

//--------------------- job search -----------------------------------------
 
router.get("/search", searchCoachings);
 

// -------------------- Likes --------------------

router.post("/like/unlike", toggle_like);
router.get("/getlike", get_like_status);

// --------------------Comments--------------------
router.post("/comment", addComment);
router.get("/:id/comments", getComment);
router.delete("/comment/:id", deleteComment);

router.get("/:ask_reply_id", getRepliesByAskId);

module.exports = router;
