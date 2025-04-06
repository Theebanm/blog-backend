const express = require("express");
const isAuth = require("../config/middleware/isAuth");
const postController = require("../config/controller/postController");

const postRoute = express.Router();

postRoute.post("/", isAuth, postController.addPost);
postRoute.get("/", isAuth, postController.getPosts);
postRoute.get("/:id", isAuth, postController.getPost);
postRoute.put("/:id", isAuth, postController.updatePost);
postRoute.delete("/:id", isAuth, postController.deletePost);

module.exports = postRoute;
