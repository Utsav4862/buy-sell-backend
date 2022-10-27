const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://utsavdholiya48:buysell@cluster0.he1uta9.mongodb.net/Buy-Sell?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connected");
  });
