const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET all users
router.get("/", userController.getAllUsers);

// GET user by ID
router.get("/:id", userController.getUserById);

// UPDATE user
router.put("/:id", userController.updateUser);

// CHANGE password
router.put("/:id/change-password", userController.changePassword);

// DELETE user
router.delete("/:id", userController.deleteUser);

module.exports = router;