const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog",
    format: async (req, file) => path.extname(file.originalname).substring(1), // Returns "png", "jpg", etc.
    public_id: (req, file) => file.fieldname + "_" + Date.now(), // Use the original file name as the public ID
  },
});

// Multer Upload
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

module.exports = upload;
