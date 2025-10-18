const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/upload");

// -------------------- Coaching Posts --------------------

// POST - Create coaching post
router.post("/post/create", upload.single("image"), createPost);
router.get("/post/get", getPost);
router.get("/post/:id", getPostsByUserId);
router.delete("/post/:id", deletePost);

// -------------------- Comments --------------------

// Add new comment
router.post("/comment", addComment);
router.get("/:id/comments", getComment);
router.delete("/comment/:id", deleteComment);

module.exports = router;
