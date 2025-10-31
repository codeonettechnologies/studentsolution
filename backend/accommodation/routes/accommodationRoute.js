const express = require("express");
const router = express.Router();

const {
    accommodation_post,
    get_all_accommodation_posts,
    getaccommodationPostsByUserId,
    delete_accommodation_post,
    add_comment,
    get_comments,
    delete_comment,
    toggle_like,
    get_like_status,
    searchAccommodation
} = require("../controllers/postController")
const upload = require("../../middlewares/upload")

router.post('/post/create', upload.single('image'), accommodation_post);
router.get('/post/get', get_all_accommodation_posts);
router.get('/postGet/:userId', getaccommodationPostsByUserId);
router.delete("/post/:id", delete_accommodation_post);

// --------------- comments routes-------------------------------------------------------------------------

router.post("/comment", add_comment);
router.get("/:id/comments", get_comments);
router.delete("/comment/:id", delete_comment);

//-------------like route------------------------------------------------------------
router.post("/like/unlike", toggle_like);
router.get("/getlike", get_like_status);
  
//---------------------------- search ------------------------------
router.get("/searchPost", searchAccommodation);
module.exports = router;