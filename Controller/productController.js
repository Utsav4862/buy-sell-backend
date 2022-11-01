const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
app.use(express.json());
// const fs = require("fs");
const { promisify } = require("util");
const Product = require("../Model/Product");
const Chat = require("../Model/Chat");

// const unlinkAsync = promisify(fs.unlink);
const addProduct = async (req, res) => {
  try {
    let user = await req.user;

    console.log(user);
    const url = (await req.protocol) + "://" + req.get("host");
    let images = [];
    let files = await req.files;
    for (let e of files) {
      images.push(url + "/" + e.filename);
    }

    console.log(images, "heyy");
    let { category } = await req.body;

    let resp;
    if (category == "Car" || category == "Bike") {
      const { brand, model, year, km, title, desc, category, price, location } =
        await req.body;
      resp = await Product.create({
        brand,
        model,
        year,
        km,
        title,
        desc,
        images,
        price,
        location,
        category,
        user: user._id,
      });
    } else if (category == "Mobile") {
      const { brand, model, year, title, desc, category, price, location } =
        await req.body;
      resp = await Product.create({
        brand,
        model,
        year,
        title,
        desc,
        images,
        category,
        price,
        location,
        user: user._id,
      });
    } else if (category == "Lifestyle") {
      const { subCat, title, desc, price, location, category } = await req.body;
      resp = await Product.create({
        category,
        subCat,
        title,
        desc,
        images,
        price,
        location,
        user: user._id,
      });
    } else {
      const { subCat, title, desc, price, location } = await req.body;
      resp = await Product.create({
        category,
        subCat,
        title,
        desc,
        images,
        price,
        location,
        user: user._id,
      });
    }

    res.send(resp);
  } catch (error) {
    console.log(error);
  }
};

const fetchProducts = async (req, res) => {
  try {
    let all = await Product.find()
      .populate("user", "-password")
      .sort({ createdAt: -1 });
    res.send(all);
  } catch (error) {
    throw new Error(error.message);
  }
};

const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { category: { $regex: req.query.search, $options: "i" } },
            { title: { $regex: req.query.search, $options: "i" } },
            { subCat: { $regex: req.query.search, $options: "i" } },
            { brand: { $regex: req.query.search, $options: "i" } },
            { model: { $regex: req.query.search, $options: "i" } },
            { desc: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const keyword2 = req.query.location
      ? { location: { $regex: req.query.location, $options: "i" } }
      : {};
    console.log(keyword2);
    let prod;
    if (req.query.location == "") {
      prod = await Product.find(keyword)
        .populate("user", "-password")
        .sort({ createdAt: -1 });
    } else {
      prod = await Product.find(keyword)
        .find(keyword2)
        .populate("user", "-password")
        .sort({ createdAt: -1 });
    }
    console.log(prod);
    res.send(prod);
  } catch (error) {
    throw new Error(error.message);
  }
};

const findByCategory = async (req, res) => {
  try {
    const { category } = req.body;

    let products = await Product.find({ category: category });
    res.send(products);
  } catch (error) {
    throw new Error(error.message);
  }
};

const myProducts = async (req, res) => {
  try {
    const user = await req.user;
    let products = await Product.find({ user: user._id }).populate(
      "user",
      "-password"
    );
    res.send(products);
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    let user = await req.user;
    let { productId } = req.params;
    await Chat.deleteMany({
      product: productId,
    });
    let resp = await Product.findByIdAndDelete(productId);
    res.send(resp);
  } catch (error) {
    throw new Error(error.message);
  }
};

const likeProduct = async (req, res) => {
  try {
    const user = await req.user;
    console.log(req.body);
    Product.findByIdAndUpdate(
      req.body.productId,
      {
        $push: { likes: user._id },
      },
      {
        new: true,
      }
    )
      .populate("user", "-password")
      .exec((err, result) => {
        if (err) console.log(err);
        else {
          console.log(result);
          res.send(result);
        }
      });
  } catch (error) {
    throw new Error(error.message);
  }
};

const unLikeProduct = async (req, res) => {
  try {
    const user = await req.user;
    console.log(req.body);

    let resp = Product.findByIdAndUpdate(
      req.body.productId,
      {
        $pull: { likes: user._id },
      },
      {
        new: true,
      }
    )
      .populate("user", "-password")
      .exec((err, resp) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(resp);
        res.send(resp);
      });
  } catch (error) {
    throw new Error(error.message);
  }
};

const likedProducts = async (req, res) => {
  try {
    const user = req.user;
    let products = await Product.find({
      likes: { $elemMatch: { $eq: user._id } },
    }).populate("user", "-password");

    res.send(products);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  addProduct,
  fetchProducts,
  searchProducts,
  findByCategory,
  myProducts,
  likeProduct,
  unLikeProduct,
  likedProducts,
  deleteProduct,
};
