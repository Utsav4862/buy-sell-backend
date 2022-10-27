const mongoose = require("mongoose");

const mobileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    brand: String,
    model: String,
    year: Number,
    title: String,
    desc: String,
    images: [String],
    price: Number,
    location: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mobile", mobileSchema);
