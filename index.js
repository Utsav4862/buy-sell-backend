const express = require("express");
require("./config");

const cors = require("cors");
const app = express();

app.use(express.json());
const jwt = require("jsonwebtoken");

const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
    parameterLimit: 10000,
    limit: "100mb",
  })
);

const routes = require("./routes/index");
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use("/api", routes);
const server = app.listen(process.env.PORT || 5555);

const io = require("socket.io")(server, {
  cors: "*",
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});
