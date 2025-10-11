const express = require("express");
const router = express.Router();
const { job_post ,
    get_all_job_posts ,
     get_job_post_by_id , 
     delete_job_post ,
    add_like,
    remove_like,
     get_likes,
     add_comment,
     get_comments,
     delete_comment
    } = require("../controllers/jobController");

const upload = require("../../middlewares/upload")

router.post('/job-post', upload.single('image'), job_post);
router.get('/get', get_all_job_posts);
router.get("/job_post/:id", get_job_post_by_id);
router.delete("/job_post/:id", delete_job_post);

//-------------------like post ------------------------------
router.post("/like", add_like);
router.delete("/unlike", remove_like);
router.get("/job_post/:id/likes", get_likes);

//-------------------comments route -----------------

router.post("/comment", add_comment);
router.get("/job_post/:id/comments", get_comments);
router.delete("/comment/:id", delete_comment);


module.exports = router;
