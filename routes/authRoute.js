const express = require("express");
const authController = require("../config/controller/authController");
const isAuth = require("../config/middleware/isAuth");

const authRoute = express.Router();

authRoute.post("/register", authController.register);
authRoute.post("/login", authController.login);
authRoute.post("/send-verification-email", authController.verifyEmail);
authRoute.post("/verify-user", authController.verifyUser);
authRoute.get("/current-user", isAuth, authController.currentUser);
authRoute.post("/forget-password-code", authController.forgetPasswordCode);
authRoute.post("/recover-password", authController.recoverPassword);
authRoute.put("/change-password", isAuth, authController.changePassword);
authRoute.put("/update-profile", isAuth, authController.updateProfile);
authRoute.delete("/delete-profile/:id", isAuth, authController.deleteProfile);

module.exports = authRoute;
