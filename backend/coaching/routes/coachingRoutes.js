const express = require("express");
const router = express.Router();
const {
  createPost,
  getPost,
  getCoachingPostsByUserId,
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
router.get('/postGet/:userId', getCoachingPostsByUserId);
router.delete("/post/:id", deletePost);

// -------------------- Likes --------------------

router.post("/like/unlike", toggle_like);
router.get("/getlike", get_like_status);
// -------------------- Comments --------------------

// Add new comment
router.post("/comment", addComment);
router.get("/:id/comments", getComment);
router.delete("/comment/:id", deleteComment);



//-----------------------------coaching aks --------------------------
const {createCoachingAsk ,getAllCoachingAsks, getCoachingAsktsByUserId} = require("./controllers/coachingAskController")
router.post("/coachingAsk", createCoachingAsk);
router.get("/coachingAskGet", getAllCoachingAsks);
router.get('/askGet/:userId', getCoachingAsktsByUserId);


//------------------------coaching reply------------------------

const {createReply ,getRepliesByAskId} = require("./controllers/coachingReplyController")
router.post("/coachingReply", createReply);
router.get("/:ask_reply_id", getRepliesByAskId);

module.exports = router;
