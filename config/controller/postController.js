const asyncHandler = require("express-async-handler");
const Post = require("../../model/Post");
const Category = require("../../model/Category");
const mongoose = require("mongoose");
const postController = {
  addPost: asyncHandler(async (req, res) => {
    const { title, desc, files, category } = req.body;
    if (!title || !files || !category) {
      res.status(400);
      throw new Error("Please fill all the required fields");
    }
    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400);
      throw new Error("Invalid category id");
    }
    if (!mongoose.Types.ObjectId.isValid(files)) {
      res.status(400);
      throw new Error("Invalid file id");
    }
    const post = await Post.create({
      title,
      desc,
      files,
      category,
      author: req.user._id,
    });
    await post.save();
    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  }),
  updatePost: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, desc, files, category } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        res.status(400);
        throw new Error("Invalid category id");
      }

      const categoryFound = await Category.findById(category);
      if (!categoryFound) {
        res.status(404);
        throw new Error("Category not found");
      }
    }
    if (files) {
      if (!mongoose.Types.ObjectId.isValid(files)) {
        res.status(400);
        throw new Error("Invalid file id");
      }

      const fileFound = await File.findById(files);
      if (!fileFound) {
        res.status(404);
        throw new Error("File not found");
      }
    }
    title ? (post.title = title) : post.title;
    desc ? (post.desc = desc) : post.desc;
    files ? (post.files = files) : post.files;
    category ? (post.category = category) : post.category;
    await post.save();
    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  }),
  deletePost: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  }),
  getPosts: asyncHandler(async (req, res) => {
    const { page, size, q, category } = req.query;
    const pageNo = parseInt(page) || 1;
    const sizeNo = parseInt(size) || 10;
    let query = {}; // Default empty query

    if (q) {
      let search = new RegExp(q, "i"); // Case-insensitive regex search
      query = {
        $or: [{ title: search }, { desc: search }],
      };
    }

    if (category) {
      query = { ...query, category };
    }
    // No need for { query }, directly pass query
    const countDoc = await Post.find(query).countDocuments();

    const pages = Math.ceil(countDoc / sizeNo);

    const posts = await Post.find(query)
      .sort({ updatedAt: -1 })
      .skip((pageNo - 1) * sizeNo)
      .limit(sizeNo)
      .populate("category")
      .populate("files")
      .populate("author")
      .select("-password -verificationCode -forgetPasswordCode");
    res.status(200).json({
      message: "Posts fetched successfully",
      data: {
        posts,
        pages,
        countDoc,
      },
    });
  }),
  getPost: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("category")
      .populate("files")
      .populate("author")
      .select("-password -verificationCode -forgetPasswordCode");
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }
    res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  }),
  deletePost: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  }),
};

module.exports = postController;
