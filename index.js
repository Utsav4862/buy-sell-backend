const express = require("express");
require("./config");

const cors = require("cors");
const app = express();

app.use(express.json());
const jwt = require("jsonwebtoken");

const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
    parameterLimit: 10000,
    limit: "100mb",
  })
);

const routes = require("./routes/index");
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use("/api", routes);
app.listen(5555);
