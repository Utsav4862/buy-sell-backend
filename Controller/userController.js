const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());
const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const nodemailer = require("nodemailer");
const key = "Buy-Sell";

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  requireTLS: true,
  auth: {
    user: "utsavdholiya48@gmail.com",
    pass: "utsav4862dholiya",
  },
});

const signUp = async (req, res) => {
  console.log(req.body);
  let exist = await User.exists({ email: req.body.email });
  const { name, email, password } = req.body;
  console.log(exist);
  if (exist) {
    res.send({ exist: "User Already Exist" });
  } else {
    let encryptedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    res.send({ user: user });
  }
};

const login = async (req, res) => {
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
};

const sendVerificationEmail = async (req, res) => {
  const otp = `${1000 + Math.random() * 1000}`;
  console.log(otp);
  let mailOptions = {
    from: "utsavdholiya48@gmail.com",
    to: req.body.email,
    subject: "test",
    text: "hello...",
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info.response);
      res.send(info.response);
    }
  });
};

const getCurrentUser = async (req, res) => {
  //   console.log(req);
  let user = await req.user;
  res.send(user);
};

module.exports = { signUp, login, getCurrentUser, sendVerificationEmail };
