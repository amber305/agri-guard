const express = require("express");
const { getAllUsers, getAllOrders, deleteUser, getAllProducts, createProduct, updateProduct, deleteProduct, getOrderById, updateOrderStatus, deleteOrder } = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/users", protect, adminMiddleware, getAllUsers);
router.get("/orders", protect, adminMiddleware, getAllOrders);
router.delete("/users/:id", protect, adminMiddleware, deleteUser);

// Product management
router.get('/products', protect, adminMiddleware, getAllProducts);
router.post('/products', protect, adminMiddleware, createProduct);
router.put('/products/:id', protect, adminMiddleware, updateProduct);
router.delete('/products/:id', protect, adminMiddleware, deleteProduct);

// Order management
router.get('/orders', protect, adminMiddleware, getAllOrders);
router.get('/orders/:id', protect, adminMiddleware, getOrderById);
router.put('/orders/:id', protect, adminMiddleware, updateOrderStatus);
router.delete('/orders/:id', protect, adminMiddleware, deleteOrder);

module.exports = router;
