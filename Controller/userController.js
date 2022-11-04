const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());
const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const nodemailer = require("nodemailer");
const key = "Buy-Sell";
var otpGenerator = require("otp-generator");
const cloudinary = require("../cloudinary");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,

  requireTLS: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const signUp = async (req, res) => {
  try {
    console.log(req.body);
    let exist = await User.exists({ email: req.body.email });
    const { name, email, password } = req.body;
    console.log(exist);
    if (exist) {
      res.send({ error: "User Already Exists !!! " });
      return;
    }
    let encryptedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    res.send({ success: true, user: user });
  } catch (error) {
    throw new Error(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const verifyPass = await bcrypt.compare(password, user.password);
      if (verifyPass) {
        const token = await jwt.sign({ user }, key);
        await res.send({ token });
      } else {
        res.send({ error: "Password is Wrong" });
      }
    } else {
      res.send({ error: "User not Found" });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const sendVerificationEmail = async (req, res) => {
  try {
    let exist = await User.exists({ email: req.body.email });
    const { name, email } = req.body;
    console.log(exist);
    if (exist) {
      res.send({ error: "User Already Exists !!! " });
      return;
    }
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });
    console.log(otp);
    let mailOptions = {
      from: "utsavdholiya48@gmail.com",
      to: req.body.email,
      subject: "Email Verification OTP",
      html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome!!!</h2>
        <h4>You are officially In ✔</h4>
        <p style="margin-bottom: 30px;">Please enter the sign up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
   </div>
    `,
    };

    let resp = await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        res.send({ error: "Error" });
      } else {
        console.log(info.response);
        res.send({ success: true, otp: otp });
        return info.response;
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    let user = await req.user;
    res.send(user);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateImage = async (req, res) => {
  try {
    let user = await req.user;
    let img = req.files;
    console.log(img);
    let image = await req.files[0];
    let resp = await cloudinary.cloudinaryUpload(image.path);
    console.log(resp.secure_url);
    await User.findByIdAndUpdate(user._id, {
      profile_img: resp.secure_url,
    });
    await unlinkAsync(image.path);
    res.send(resp.secure_url);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  signUp,
  login,
  getCurrentUser,
  sendVerificationEmail,
  updateImage,
};
