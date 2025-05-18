const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.get("/", protect, allowRoles("customer"), getCart);
router.post("/", protect, allowRoles("customer"), addToCart);
router.delete("/:itemId", protect, allowRoles("customer"), removeFromCart);
router.patch('/:itemId', protect, updateCartItem);

module.exports = router;
