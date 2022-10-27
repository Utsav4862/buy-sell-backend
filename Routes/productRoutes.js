const express = require("express");
const {
  addProduct,
  fetchProducts,
  searchProducts,
  findByCategory,
  myProducts,
} = require("../Controller/productController");

const { auth } = require("../Middleware/auth");
const { multerSt } = require("../Middleware/multer");

const router = express.Router();

router.post("/add", auth, multerSt, addProduct);
router.get("/all", auth, fetchProducts);
router.get("/searchProducts", auth, searchProducts);
router.get("/category", auth, findByCategory);
router.get("/myProducts", auth, myProducts);

module.exports = router;
