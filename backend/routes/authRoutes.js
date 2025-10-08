const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
  adminLoginValidation
} = require("../middleware/validator");

// Register - with validation
router.post("/register", registerValidation, authController.register);

// Login (user) - with validation
router.post("/login", loginValidation, authController.login);

// Admin login - with validation
router.post("/admin-login", adminLoginValidation, authController.adminLogin);

module.exports = router;