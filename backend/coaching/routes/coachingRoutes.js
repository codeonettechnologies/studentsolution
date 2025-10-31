const express = require("express");
const router = express.Router();
const {
  createPost,
  getPost,
  getCoachingPostsByUserId,
  deletePost,
  searchCoachings,
  addComment,
  getComment,
  deleteComment,
  toggle_like,
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


// coaching Ask 
const {createCoachingAsk ,getAllCoachingAsks , getCoachingAsktsByUserId, searchAskcoachings, delete_ask} = require("./controllers/coachingAskController")
router.post("/caochingAsk", createCoachingAsk);
router.get("/coachingAskGet", getAllCoachingAsks);
router.get('/askGet/:userId', getCoachingAsktsByUserId);
router.delete("/ask/:id", delete_ask);
router.get("/searchAsk", searchAskcoachings);


const {createReply ,getRepliesByAskId, delete_reply} = require("./controllers/coachingReplyController")
router.post("/CoachingReply" , createReply)
router.get("/:ask_reply_id", getRepliesByAskId);
router.delete("/reply/:id", delete_reply);



module.exports = router;
