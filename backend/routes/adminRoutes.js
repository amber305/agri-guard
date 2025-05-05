const express = require("express");
const { getAllUsers, getAllOrders, deleteUser, getAllProducts, createProduct, updateProduct, deleteProduct, getOrderById, updateOrderStatus, deleteOrder } = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

// Product management
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order management
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

module.exports = router;
