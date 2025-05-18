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

router.post("/", protect, allowRoles("customer"), placeOrder);
router.get("/mine", protect, allowRoles("customer"), getMyOrders);
// router.get("/:id", protect, getOrderDetails);
router.get("/", protect, allowRoles("admin", "supplier"), getOrders);

router.get('/my-orders', protect, getMyOrdersForUser);
router.get('/:id', protect, getOrderByIdForUser);

module.exports = router;
