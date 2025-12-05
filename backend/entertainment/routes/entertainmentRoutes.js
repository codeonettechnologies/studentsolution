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
  get_like_status,
  getUserEntertainmentPosts
} = require("../controllers/entertainmentPostController");

const upload = require("../../middlewares/upload");

//---------------post routes--------------------------------
router.post("/post/create", upload.single("image"), entertainmentPost);
router.get("/post/get", getall_entertainment_posts);
router.get("/postGet/:userId", getentertainmentPosts_byUserId);
router.delete("/post/:id", delete_entertainmentPosts);
router.get("/userPost/:id", getUserEntertainmentPosts);
//--------------------- Entertainment search -----------------------------------------
 
router.get("/searchPost", searchEntertainments);


//-------------like route----------------------------
router.post("/like/unlike", toggle_like);
router.get("/getlike", get_like_status);
 
 
//-------------------comments route -----------------
 
router.post("/comment", add_comment);
router.get("/:id/comments", get_comments);
router.delete("/comment/:id", delete_comment);

//------------------Entertainment ask routes ------------------------------------- 
const {createEntertainmentAsk ,getAllEntertainmentAsks , getEntertainmentAsktsByUserId, delete_ask, searchAskentertainment} = require("../controllers/entertainmentAskController")
router.post("/EntertainmentAsk", createEntertainmentAsk);
router.get("/EntertainmentAskGet", getAllEntertainmentAsks);
router.get('/askGet/:userId', getEntertainmentAsktsByUserId);
router.delete("/ask/:id", delete_ask);
router.get("/searchAsk", searchAskentertainment);


//------------- Entertainment reply route-----------------------------------------------------
const {createReply ,getRepliesByAskId, delete_reply} = require("../controllers/entertainmentReplyController")
router.post("/EntertainmentReply" , createReply)
router.get("/:ask_reply_id", getRepliesByAskId);
router.delete("/reply/:id", delete_reply);
 


module.exports = router;
