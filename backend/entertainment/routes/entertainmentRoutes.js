const express = require("express");
const router = express.Router();

const {
  entertainmentPost,
  getall_entertainment_posts,
  getentertainmentPosts_byUserId,
  delete_entertainmentPosts,
  searchEntertainments,
  add_comment,
  get_comments,
  delete_comment,
  toggle_like,
  get_like_status
} = require("../controllers/entertainmentPostController");

const upload = require("../../middlewares/upload");

//---------------post routes--------------------------------
router.post("/post/create", upload.single("image"), entertainmentPost);
router.get("/post/get", getall_entertainment_posts);
router.get("/postGet/:userId", getentertainmentPosts_byUserId);
router.delete("/post/:id", delete_entertainmentPosts);

//--------------------- Entertainment search -----------------------------------------
 
router.get("/search", searchEntertainments);


//-------------like route----------------------------
router.post("/like/unlike", toggle_like);
router.get("/getlike", get_like_status);
 
 
//-------------------comments route -----------------
 
router.post("/comment", add_comment);
router.get("/:id/comments", get_comments);
router.delete("/comment/:id", delete_comment);

//------------------Entertainment ask routes ------------------------------------- 
const {createEntertainmentAsk ,getAllEntertainmentAsks , getEntertainmentAsktsByUserId} = require("../controllers/entertainmentAskController")
router.post("/EntertainmentAsk", createEntertainmentAsk);
router.get("/EntertainmentAskGet", getAllEntertainmentAsks);
router.get('/askGet/:userId', getEntertainmentAsktsByUserId);

//------------- Entertainment reply route-----------------------------------------------------
const {createReply ,getRepliesByAskId} = require("../controllers/entertainmentReplyController")
router.post("/EntertainmentReply" , createReply)
router.get("/:ask_reply_id", getRepliesByAskId);


module.exports = router;
