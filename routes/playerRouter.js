const express = require("express");
const bodyParser = require("body-parser");
const playerController = require("../controllers/playerController");
const multer = require("multer");
const { ensureAuthenticated, jwtAuth } = require('../config/auth');
const { requireRole } = require('../config/verifyRole');
const cloudinary = require('cloudinary').v2;

// Cấu hình kết nối với Cloudinary
cloudinary.config({
  cloud_name: 'drvrfmcji',
  api_key: '955699232226773',
  api_secret: 'Fl8t8OdH_3Lo5Ke8hj4kz1tg34g'
});

const upload = multer({
  storage: multer.diskStorage({}),
});

const playerRouter = express.Router();
playerRouter.use(bodyParser.json());

// Middleware để upload ảnh lên Cloudinary
const uploadImage = async (req, res, next) => {
  const file = req.file;
  console.log(file)
  if (file) {
    try {
      const result = await cloudinary.uploader.upload(file.path);
      req.body.image = result.secure_url; // Lấy URL của ảnh và gán vào dữ liệu
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Upload failed");
      return res.redirect("/players");
    }
  }
  next();
};

playerRouter
  .route("/")
  .get(jwtAuth, requireRole, playerController.index)
  .post(jwtAuth, requireRole, upload.single("file"), uploadImage, playerController.create);

playerRouter
  .route("/edit/:playerId")
  .get(jwtAuth, requireRole, playerController.formEdit)
  .post(jwtAuth, requireRole, upload.single("file"), uploadImage, playerController.edit);

playerRouter.route("/:playerId").get(playerController.playerDetail);
playerRouter.route("/delete/:playerId").get(jwtAuth, requireRole, playerController.delete);

module.exports = playerRouter;