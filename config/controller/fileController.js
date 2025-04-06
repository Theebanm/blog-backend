const path = require("path");
const asyncHandler = require("express-async-handler");
const File = require("../model/File");
const upload = require("../middleware/upload");
const { uploader } = require("../config/cloudinary");
const fileController = {
  uploadFile: asyncHandler(async (req, res) => {
    const file = req.file;
    console.log(file);

    if (!file) {
      res.status(400);
      throw new Error("Please upload a file");
    }
    const ext = path.extname(file.originalname);

    if (ext == ".jpg" || ext == ".png" || ext == ".jpeg") {
      const uploaded = await File.create({
        url: req.file.path,
        public_id: req.file.filename,
        size: req.file.size,
        createdBy: req.user._id,
        mimetype: req.file.mimetype,
      });

      res.status(201).json({
        message: "File uploaded successfully",
        uploaded,
      });
    } else {
      res.status(400);
      throw new Error(
        "Please upload a valid file extension only in jpg,png,jpeg"
      );
    }
  }),
  deleteFile: asyncHandler(async (req, res) => {
    const { public_id } = req.body;

    if (!public_id) {
      res.status(400);
      throw new Error("Please provide a valid public id");
    }

    const file = await File.findOne({ public_id });
    const result = await uploader.destroy(file.public_id);

    await File.findByIdAndDelete(file._id);

    res.status(200).json({
      message: "File deleted successfully",
    });
  }),
};

module.exports = fileController;
