const express = require("express");
const router = express.Router();
const {
    getAllProducts,
  getMyProducts,
  getProductById,
  createProduct,
  deleteProduct,
  approveProduct,
  rejectProduct,
  updateProduct,
  getFeatured,
  getPendingProducts,
  toggleFeatured
} = require("../controllers/productController");

const { allowRoles } = require("../middleware/roleMiddleware");
const { protect, isAdmin } = require('../middleware/authMiddleware');


router.get("/", getAllProducts);
router.get("/featured", getFeatured);
router.post("/", protect, allowRoles("admin", "supplier"), createProduct);
router.put("/:id", protect, allowRoles("admin", "supplier"), updateProduct);
router.delete("/:id", protect, allowRoles("admin"), deleteProduct);
router.get('/mine', protect, getMyProducts);
// router.post('/', protect, createProduct);

router.get('/pending', protect, isAdmin, getPendingProducts);
router.patch('/:id/approve', protect, isAdmin, approveProduct);
router.patch('/:id/reject', protect, isAdmin, rejectProduct);
router.put('/:id', protect, updateProduct); // supplier can only edit their own product
router.patch('/:id/feature', protect, isAdmin, toggleFeatured);
router.get('/:id', getProductById);//This must be placed after more specific routes (like /mine, /featured, /pending) — otherwise it can accidentally capture those paths as :id.



module.exports = router;
