const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
    },
    otp: String,
    expiredAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OTP", userSchema);
