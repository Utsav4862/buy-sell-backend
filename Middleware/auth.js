const jwt = require("jsonwebtoken");
const key = "Buy-Sell";

const auth = async (req, res, next) => {
  try {
    let token = await req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, key);

    req.user = decoded["user"];
    next();
  } catch (err) {
    res.send({
      error: "Unauthorized User!!!",
    });
  }
};

module.exports = { auth };
