/**
 * Order routes.
 * @module routes/orderRoutes
 */
const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getOrders,
  getMyOrders,
  getOrderDetails,
  getMyOrdersForUser,
  getOrderByIdForUser
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// Customer routes
router.post("/", protect, allowRoles("customer"), placeOrder);
router.get("/mine", protect, allowRoles("customer"), getMyOrders);
// router.get("/:id", protect, getOrderDetails);

// Admin and supplier routes
router.get("/", protect, allowRoles("admin", "supplier"), getOrders);

// User-specific routes
router.get('/my-orders', protect, getMyOrdersForUser);
router.get('/:id', protect, getOrderByIdForUser);

module.exports = router;
