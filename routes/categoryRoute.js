const express = require("express");
const categoryController = require("../config/controller/categoryController");
const isAuth = require("../config/middleware/isAuth");
const isAdmin = require("../config/middleware/isAdmin");

const categoryRoute = express.Router();

categoryRoute.post("/", isAuth, isAdmin, categoryController.addCategory);
categoryRoute.put("/:id", isAuth, isAdmin, categoryController.updateCategory);
categoryRoute.get("/:id", isAuth, categoryController.getCategory);
categoryRoute.get("/", isAuth, categoryController.getCategories);
categoryRoute.delete(
  "/:id",
  isAuth,
  isAdmin,
  categoryController.deleteCategory
);

module.exports = categoryRoute;
