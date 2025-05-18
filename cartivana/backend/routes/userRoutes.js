const express = require("express");
const router = express.Router();
const {
  getProfile,
  getAllUsers,
  deleteUser
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.get("/me", protect, getProfile);
router.get("/", protect, allowRoles("admin"), getAllUsers);
router.delete("/:id", protect, allowRoles("admin"), deleteUser);

module.exports = router;
