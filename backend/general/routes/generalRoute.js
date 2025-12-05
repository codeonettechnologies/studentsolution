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
  getUserGeneralPosts,
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
router.get("/userPost/:id", getUserGeneralPosts);
//------------------General ask routes -------------------------------------
const {
  createGeneralAsk,
  getAllGeneralAsks,
  getGeneralAsktsByUserId,
  searchAskGenerals,
  delete_ask,
  getUserGeneralAsk
} = require("../controllers/aksController");

router.post("/generalAsk", createGeneralAsk);
router.get("/generalAskGet", getAllGeneralAsks);
router.get("/askGet/:userId", getGeneralAsktsByUserId);
router.delete("/ask/:id", delete_ask);
router.get("/searchAsk", searchAskGenerals);
router.get("/userAsk/:id", getUserGeneralAsk);
//------------- job reply route-----------------------------------------------------------------
const {
  createReply,
  getRepliesByAskId,
  delete_reply,
} = require("../controllers/replyController");
router.post("/generalReply", createReply);
router.get("/:ask_reply_id", getRepliesByAskId);
router.delete("/reply/:id", delete_reply);

module.exports = router;