const express = require("express");
const { 
  placeOrder, 
  getMyOrders, 
  getOrderById, 
  updateOrderStatus,
  getOrders 
} = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Public routes
router.route('/')
  .post(protect, placeOrder)
  .get(protect, admin, getOrders);

router.get('/myorders', protect, getMyOrders);
router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, admin, updateOrderStatus);

module.exports = router;
