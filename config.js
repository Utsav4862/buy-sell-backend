const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI.toString(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  });
