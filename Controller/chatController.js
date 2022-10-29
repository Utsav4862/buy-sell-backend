const Chat = require("../Model/Chat");
const Product = require("../Model/Product");
const User = require("../Model/User");

const accessChat = async (req, res) => {
  const { userId, productId } = req.body;
  console.log();

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
      chatName: "sender",
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
      console.log("created");
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
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        results = await Product.populate(results, {
          path: "product.user",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { accessChat, fetchChats };
