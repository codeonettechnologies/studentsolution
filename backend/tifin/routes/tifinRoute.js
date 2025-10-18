const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/upload");

const {
  tiffin_post,
  get_all_tiffin_posts,
  getTiffinPostsByUserId,
  delete_tiffin_post,
  post_comment,
  get_comments,
  delete_comment,
  toggle_like,
  get_like_status
} = require("../../tifin/controllers/tifinPostController");

//-----------------tiffin router-------------------------------------------------
router.post("/post/create", upload.single("image"), tiffin_post);
router.get("/post/get", get_all_tiffin_posts);
router.get("/postGet/:userId", getTiffinPostsByUserId);
router.delete("/post/:id", delete_tiffin_post);

//-------------------comments route -----------------
 
router.post("/comment", post_comment);
router.get("/:id/comments", get_comments);
router.delete("/comment/:id", delete_comment);

//-------------like route----------------------------
router.post("/like/unlike", toggle_like);
router.get("/getlike", get_like_status);

//------------------job ask routes ------------------------------------- 
const {createTiffinAsk ,getAllTiffinAsks} = require("../controllers/tiffinAskController")
router.post("/tiffinAsk", createTiffinAsk);
router.get("/tiffinAskGet", getAllTiffinAsks);

const {createReply ,getRepliesByAskId} = require("../controllers/tiffinReplyController")
router.post("/tiffinReply" , createReply)
router.get("/:ask_reply_id", getRepliesByAskId);

module.exports = router;
