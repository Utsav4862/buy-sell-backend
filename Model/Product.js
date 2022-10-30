const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: String,
    subCat: String,
    brand: String,
    model: String,
    year: Number,
    km: Number,
    title: String,
    desc: String,
    images: [String],
    price: Number,
    location: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

productSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Product", productSchema);
