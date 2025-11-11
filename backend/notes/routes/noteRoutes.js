const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/upload");
const { postNotes  , getNotes ,getNotesByUserId ,deleteNotesByUser ,searchNotes} = require("../controllers/notesPostController");


router.post(
  "/notePost",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  postNotes
);
router.get("/getNotes", getNotes);
router.get("/getNotes/:userId", getNotesByUserId);
router.delete("/deleteNote/:noteId", deleteNotesByUser);
router.get("/searchNotes", searchNotes);



const {
  createNoteAsk,
  getAllNoteAsks,
  getNoteAsktsByUserId,
  searchAsknotes,
  delete_ask,
} = require("../controllers/aksController");
router.post("/noteAsk", createNoteAsk);
router.get("/notesAskGet", getAllNoteAsks);
router.get("/askGet/:userId", getNoteAsktsByUserId);
router.delete("/ask/:id", delete_ask);
router.get("/searchAsk", searchAsknotes);


const {
  createReply,
  getRepliesByAskId,
  delete_reply,
} = require("../controllers/replyController");
router.post("/notesReply", createReply);
router.get("/:ask_reply_id", getRepliesByAskId);
router.delete("/reply/:id", delete_reply);


module.exports = router;
