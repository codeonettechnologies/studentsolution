const express = require('express');
const router = express.Router();
const {createPost,getPost,getPostsByUserId,deletePost, addLike, addComment,getComment,deleteComment} = require('./controllers/coachingControllers');

const upload = require('../../middlewares/upload');

// -------------------- Coaching Posts --------------------

// POST - Create coaching post
router.post('/create', upload.single('image_url'),createPost);

// GET - Get all posts
router.get('/get',getPost);

// GET - Get posts by user ID
router.get('/get/user/:userId',getPostsByUserId);

// DELETE - Delete post
router.delete('/:id',deletePost);

// -------------------- Likes --------------------

router.post('/like',addLike);
// -------------------- Comments --------------------

// Add new comment
router.post('/comment',addComment);

// Get all comments (or by coaching_id via query param ?coaching_id=...)
router.get('/comment', getComment);

// Delete comment by ID
router.delete('/comment/:id',deleteComment);

module.exports = router;
