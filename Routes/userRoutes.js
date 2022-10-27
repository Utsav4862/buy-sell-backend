const express = require("express");
const {
  signUp,
  login,
  getCurrentUser,
  sendVerificationEmail,
} = require("../Controller/userController");
const { auth } = require("../Middleware/auth");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/currentUser", auth, getCurrentUser);
router.post("/sendEmail", sendVerificationEmail);

module.exports = router;
