const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const generateCode = require("../utils/generateCode");
const sendEmail = require("../utils/sendEmail");
const validateEmail = require("../utils/validEmail");
const File = require("../model/File");
const authController = {
  register: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields , Name ,Email,Password");
    }
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address,Please Provide a valid email",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      message: "Registration Successfull",
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  }),
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields , Email,Password");
    }
    if (!validateEmail(email)) {
      res.status(400);
      throw new Error("Invalid email address,Please Provide a valid email");
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user);
      res.status(200).json({
        message: "Login Successfull",
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400);
      throw new Error("Invalid Credentials");
    }
  }),
  verifyEmail: asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("Please fill all the fields , Email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.isVerified) {
      res.status(400);
      throw new Error("Email already verified");
    }
    const code = generateCode(6);

    // ? Send Email
    await sendEmail({
      emailTo: user.email,
      subject: "Email Verification",
      code,
      content:
        "verify your email, Thank you for signing up with <strong>Mind Script</strong>!",
    });
    user.verificationCode = code;
    await user.save();
    res.status(200).json({
      message: "Verification code sent to your email",
    });
  }),
  verifyUser: asyncHandler(async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
      res.status(400);
      throw new Error("Please fill all the fields , Email,Code");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    if (user.verificationCode !== code) {
      res.status(400);
      throw new Error("Invalid Code");
    }
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();
    res.status(200).json({
      message: "Email verified successfully",
    });
  }),
  forgetPasswordCode: asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("Please fill all the fields , Email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    const code = generateCode(6);

    // ? Send Email
    await sendEmail({
      emailTo: user.email,
      subject: "Forget Password Code",
      code,
      content:
        "Reset your password, Thank you for signing up with <strong>Mind Script</strong>!",
    });
    user.forgetPasswordCode = code;
    await user.save();
    res.status(200).json({
      message: "Forget Password Code sent to your email successfully",
    });
  }),
  recoverPassword: asyncHandler(async (req, res) => {
    const { email, code, password } = req.body;
    if (!email || !code || !password) {
      res.status(400);
      throw new Error("Please fill all the fields , Email,Code,Password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    if (user.forgetPasswordCode !== code) {
      res.status(400);
      throw new Error("Invalid Code");
    }
    const hashedPassword = await bcrypt.hashSync(password, 10);
    user.password = hashedPassword;
    user.forgetPasswordCode = null;
    await user.save();
    res.status(200).json({
      message: "Password recovered successfully",
    });
  }),
  changePassword: asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400);
      throw new Error("Please fill all the fields , oldPassword,newPassword");
    }
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid Password is incorrect");
    }
    if (oldPassword === newPassword) {
      res.status(400);
      throw new Error("New Password cannot be same as old password");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      message: "Password changed successfully",
    });
  }),
  updateProfile: asyncHandler(async (req, res) => {
    const { name, email, profilePic } = req.body;
    const user = await User.findById(req.user._id).select(
      "-password -verificationCode -forgetPasswordCode"
    );
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const validEmail = validateEmail(email);
    if (email && !validEmail) {
      return res.status(400).json({
        message: "Invalid email address,Please Provide a valid email",
      });
    }
    if (email === user.email) {
      return res.status(400).json({
        message: "Email cannot be same as old email",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    if (profilePic) {
      const file = await File.findById(profilePic);
      if (!file) {
        res.status(404);
        throw new Error("File not found");
      }
    }

    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.profilePic = profilePic;
    if (email) {
      user.isVerified = false;
    }

    await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  }),
  deleteProfile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({
      message: "User deleted successfully",
    });
  }),
  currentUser: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id)
      .select("-password -verificationCode -forgetPasswordCode")
      .populate("profilePic");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json({
      message: "User found successfully",
      data: user,
    });
  }),
};

module.exports = authController;
