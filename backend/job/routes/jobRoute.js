const express = require("express");
const router = express.Router();
const {
  job_post,
  get_all_job_posts,
  getJobPostsByUserId,
  delete_job_post,
  add_comment,
  get_comments,
  delete_comment,
  toggle_like,
  get_like_status,
  searchJobs,
} = require("../controllers/jobController");

const upload = require("../../middlewares/upload");

//---------------post route --------------------------------
router.post("/post/create", upload.single("image"), job_post);
router.get("/post/get", get_all_job_posts);
// router.get("/post/:id", get_job_post_by_id);
router.get("/postGet/:userId", getJobPostsByUserId);
router.delete("/post/:id", delete_job_post);
router.get("/searchPost", searchJobs);

//-------------like route----------------------------
router.post("/like/unlike", toggle_like);
router.get("/getlike", get_like_status);

//-------------------comments route -----------------

router.post("/comment", add_comment);
router.get("/:id/comments", get_comments);
router.delete("/comment/:id", delete_comment);

//------------------job ask routes -------------------------------------
const {
  createJobAsk,
  getAllJobAsks,
  getJobAsktsByUserId,
  searchAskJobs,
  delete_ask,
} = require("../controllers/jobAskController");
router.post("/jobAsk", createJobAsk);
router.get("/jobAskGet", getAllJobAsks);
router.get("/askGet/:userId", getJobAsktsByUserId);
router.delete("/ask/:id", delete_ask);
router.get("/searchAsk", searchAskJobs);

//------------- job reply route-----------------------------------------------------------------
const {
  createReply,
  getRepliesByAskId,
  delete_reply,
} = require("../controllers/jobReplyController");
router.post("/jobReply", createReply);
router.get("/:ask_reply_id", getRepliesByAskId);
router.delete("/reply/:id", delete_reply);

module.exports = router;
