const express = require("express");
const nationRouter = express.Router();
const bodyParser = require("body-parser");
const nationController = require("../controllers/nationController");
const {ensureAuthenticated, jwtAuth} = require('../config/auth')
const {requireRole} = require('../config/verifyRole')
nationRouter.use(bodyParser.json());
nationRouter
  .route("/")
  .get(jwtAuth,requireRole,nationController.index)
  .post(jwtAuth,requireRole,nationController.create);
nationRouter
  .route("/edit/:nationId")
  .get(jwtAuth,requireRole, nationController.formEdit)
  .post(jwtAuth,requireRole,nationController.edit);
nationRouter.route("/delete/:nationId").get(jwtAuth,requireRole,nationController.delete);

module.exports = nationRouter;
