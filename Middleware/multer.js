const multer = require("multer");

const multerSt = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + ".png");
    },
  }),
}).array("files");

module.exports = { multerSt };
