const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const placeOrder = asyncHandler(async (req, res) => {
  const { products, shippingAddress, paymentMethod } = req.body;

  if (!products || products.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Calculate total price and verify stock
  let totalPrice = 0;
  const orderProducts = [];

  for (const item of products) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    // Update product stock
    product.stock -= item.quantity;
    await product.save();

    orderProducts.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price
    });

    totalPrice += product.price * item.quantity;
  }

  const order = await Order.create({
    user: req.user._id,
    products: orderProducts,
    totalPrice,
    shippingAddress,
    paymentMethod
  });

  res.status(201).json(order);
});

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('products.product', 'name image price')
    .sort('-createdAt');
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('products.product', 'name image price');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if the order belongs to the user or if user is admin
  if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(order);
});

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // If order is being cancelled, restore product stock
  if (status === 'cancelled' && order.status !== 'cancelled') {
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
  }

  order.status = status;
  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name')
    .sort('-createdAt');
  res.json(orders);
});

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getOrders
};
