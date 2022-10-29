const express = require("express");
const { accessChat, fetchChats } = require("../Controller/chatController");

const { auth } = require("../Middleware/auth");

const router = express.Router();

router.post("/", auth, accessChat);
router.get("/fetch", auth, fetchChats);

module.exports = router;
