require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoute");
const cors = require("cors");
const errHandler = require("./config/middleware/errHandler");
const categoryRoute = require("./routes/categoryRoute");
const fileRoute = require("./routes/fileRoute");
const postRoute = require("./routes/postRoute");

// ! Third party Middleware
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(morgan("dev"));

// ! Routes
// ? Auth
app.use("/api/v1/auth", authRoute);
// ? Category
app.use("/api/v1/category", categoryRoute);

// ? File
app.use("/api/v1/files", fileRoute);

// ? Post
app.use("/api/v1/posts", postRoute);

// ! Not Found Route
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ! Error Handler
app.use(errHandler);
// ! Server
app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
