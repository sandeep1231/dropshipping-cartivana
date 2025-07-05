/**
 * User routes.
 * @module routes/userRoutes
 */
const express = require("express");
const router = express.Router();
const {
  getProfile,
  getAllUsers,
  deleteUser
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// Get current user's profile
router.get("/me", protect, getProfile);
// Get all users (admin only)
router.get("/", protect, allowRoles("admin"), getAllUsers);
// Delete a user (admin only)
router.delete("/:id", protect, allowRoles("admin"), deleteUser);

module.exports = router;
