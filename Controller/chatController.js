const Chat = require("../Model/Chat");
const Product = require("../Model/Product");
const User = require("../Model/User");

const accessChat = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    $and: [
      {
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      },
      {
        product: productId,
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage")
    .populate("product");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  isChat = await Product.populate(isChat, {
    path: "product.user",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
    console.log("exist");
  } else {
    var chatData = {
      users: [req.user._id, userId],
      product: productId,
    };

    try {
      const createdChat = await Chat.create(chatData);
      let FullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users", "-password")
        .populate("product");

      FullChat = await Product.populate(FullChat, {
        path: "product.user",
        select: "name pic email",
      });

      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("product")
      .sort({ updatedAt: -1 })
      .then(async (resp) => {
        resp = await User.populate(resp, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        resp = await Product.populate(resp, {
          path: "product.user",
        });
        res.send(resp);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { accessChat, fetchChats };
