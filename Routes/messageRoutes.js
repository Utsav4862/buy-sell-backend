const express = require("express");
const { allMessages, sendMessage } = require("../Controller/messageController");

const { auth } = require("../Middleware/auth");

const router = express.Router();

router.get("/all/:chatId", auth, allMessages);
router.post("/send", auth, sendMessage);

module.exports = router;
