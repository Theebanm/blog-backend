const express = require("express");
const isAuth = require("../config/middleware/isAuth");
const fileController = require("../config/controller/fileController");
const upload = require("../config/middleware/upload");
const fileRoute = express.Router();

fileRoute.post(
  "/upload",
  isAuth,
  upload.single("image"),
  fileController.uploadFile
);
fileRoute.delete("/delete-file", isAuth, fileController.deleteFile);
module.exports = fileRoute;
