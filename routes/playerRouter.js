const express = require("express");
const bodyParser = require("body-parser");
const playerController = require("../controllers/playerController");
const multer = require("multer");
const {ensureAuthenticated,jwtAuth} = require('../config/auth')
const {requireRole} = require('../config/verifyRole')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/Players/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage });
const playerRouter = express.Router();
playerRouter.use(bodyParser.json());
playerRouter
  .route("/")
  .get(jwtAuth,requireRole,playerController.index)
  .post(jwtAuth,requireRole, upload.single("file"), playerController.create);
playerRouter
  .route("/edit/:playerId")
  .get(jwtAuth,requireRole, playerController.formEdit)
  .post(jwtAuth,requireRole, upload.single("file"), playerController.edit);
playerRouter.route("/:playerId").get(playerController.playerDetail);
playerRouter.route("/delete/:playerId").get(jwtAuth,requireRole,playerController.delete);
module.exports = playerRouter;
