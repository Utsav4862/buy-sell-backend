const express = require("express");
const {
  addProduct,
  fetchProducts,
  searchProducts,
  findByCategory,
  myProducts,
  likeProduct,
  unLikeProduct,
  likedProducts,
} = require("../Controller/productController");

const { auth } = require("../Middleware/auth");
const { multerSt } = require("../Middleware/multer");

const router = express.Router();

router.post("/add", auth, multerSt, addProduct);
router.get("/all", auth, fetchProducts);
router.get("/searchProducts", auth, searchProducts);
router.get("/category", auth, findByCategory);
router.get("/myProducts", auth, myProducts);
router.put("/like", auth, likeProduct);
router.put("/unlike", auth, unLikeProduct);
router.get("/likedProd", auth, likedProducts);

module.exports = router;
