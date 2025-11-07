const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/upload"); 
const {
    createUsedItemPost,
    getAllUsedItems,
    getUsedItems_byUserId,
    deleteUsedItemPost,
    searchUsedItems,
    addComment,getComment,deleteComment,
    toggle_like,getlike_status }= require("../controllers/usedItemControllers");

// Create new post
router.post("/post/create", upload.single("image"), createUsedItemPost);

// Get all posts
router.get("/post/get",getAllUsedItems);

// Get a user's own posts
router.get("/postGet/:userId",getUsedItems_byUserId);

// Delete a post
router.delete("/post/:id", deleteUsedItemPost);

//Search Post 
router.get("/searchPost", searchUsedItems);


//-------------like route----------------------------

router.post("/like/unlike", toggle_like);
router.get("/getlike", getlike_status);

//-------------------comments route -----------------
 
router.post("/comment", addComment);
router.get("/:id/comments", getComment);
router.delete("/comment/:id", deleteComment);



////////////////////////////////////////////////////////////////
const {create_UsedItemAsk,
     getAll_UsedItemAsks ,
     get_asksByUserId, 
     deleteAsk_usedItem,
     searchAsk_usedItem} = require("../controllers/usedItemAskControllers")
router.post("/Ask", create_UsedItemAsk);
router.get("/askGet", getAll_UsedItemAsks);
router.get('/askGet/:userId', get_asksByUserId);
router.delete("/ask/:id", deleteAsk_usedItem);
router.get("/searchAsk", searchAsk_usedItem);


const {createReply ,getRepliesByAskId, delete_reply} = require("../controllers/usedItemReplyControllers")
router.post("/usedItemReply" , createReply)
router.get("/:ask_reply_id", getRepliesByAskId);
router.delete("/reply/:id", delete_reply);

module.exports = router;
