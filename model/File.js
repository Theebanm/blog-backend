const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    url: String,
    public_id: { type: String, required: true },
    mimetype: String,
    size: Number,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
