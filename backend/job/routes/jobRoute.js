const express = require("express");
const router = express.Router();
const { job_post ,
    get_all_job_posts ,
     get_job_post_by_id , 
     delete_job_post ,
     add_comment,
     get_comments,
     delete_comment,
     toggle_like,
     get_like_status
    } = require("../controllers/jobController");

const upload = require("../../middlewares/upload")

//---------------post route --------------------------------
router.post('/post/create', upload.single('image'), job_post);
router.get('/post/get', get_all_job_posts);
router.get("/post/:id", get_job_post_by_id);
router.delete("/post/:id", delete_job_post);

//-------------like route----------------------------
router.post("/like/unlike", toggle_like);
router.get("/getlike", get_like_status);


//-------------------comments route -----------------

router.post("/comment", add_comment);
router.get("/:id/comments", get_comments);
router.delete("/comment/:id", delete_comment);


module.exports = router;
