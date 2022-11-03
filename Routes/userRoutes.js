const express = require("express");
const multer = require("multer");
const {
  signUp,
  login,
  getCurrentUser,
  sendVerificationEmail,
  updateImage,
} = require("../Controller/userController");
const { auth } = require("../Middleware/auth");
const { multerSt } = require("../Middleware/multer");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/currentUser", auth, getCurrentUser);
router.post("/sendEmail", sendVerificationEmail);
router.post("/updateImage", auth, multerSt, updateImage);

module.exports = router;
