const asyncHandler = require("express-async-handler");
const Category = require("../model/Category");
const mongoose = require("mongoose");
const categoryController = {
  addCategory: asyncHandler(async (req, res) => {
    const { title, desc } = req.body;

    if (!title) {
      res.status(400);
      throw new Error("Please enter category title");
    }
    const categoryExists = await Category.findOne({ title });
    if (categoryExists) {
      res.status(400);
      throw new Error("Category Already Exists");
    }

    const category = await Category.create({
      title,
      desc,
      updatedBy: req.user._id,
    });
    await category.save();
    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  }),

  getCategories: asyncHandler(async (req, res) => {
    let query = {};

    const { q, size, page } = req.query;

    const sizeNumber = parseInt(size) || 10;
    const pageNumber = parseInt(page) || 1;
    if (q) {
      let search = new RegExp(q, "i");
      query = {
        $or: [{ title: search }, { desc: search }],
      };
    }
    const total = await Category.find(query).countDocuments();
    const pages = Math.ceil(total / sizeNumber);

    const categories = await Category.find(query)
      .skip((pageNumber - 1) * sizeNumber)
      .limit(sizeNumber);
    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
      size,
      page,
    });
  }),
  getCategory: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const categoryFound = await Category.findById(id);
    if (!categoryFound) {
      res.status(404);
      throw new Error("Category not found");
    }
    res.status(200).json({
      message: "Category fetched successfully",
      categoryFound,
    });
  }),
  updateCategory: asyncHandler(async (req, res) => {
    const { title, desc } = req.body;
    const { id } = req.params;
    if (id !== mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid category id");
    }

    if (title == "" || desc == "") {
      res.status(400);
      throw new Error("Please enter category title and description");
    }
    const category = await Category.findById(id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    const isCategoryExist = await Category.findOne({ title });

    if (isCategoryExist) {
      res.status(400);
      throw new Error("Category Already Exists");
    }

    category.title = title ? title : category.title;
    category.desc = desc ? desc : category.desc;
    category.updatedBy = req.user._id;
    await category.save();
    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  }),

  deleteCategory: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    await Category.findByIdAndDelete(id);
    res.status(200).json({
      message: "Category deleted successfully",
    });
  }),
};

module.exports = categoryController;
