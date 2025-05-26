import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

// Get all orders (admin only)
const getAllOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get user's orders
const getMyOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/myorders`, config);
  return response.data;
};

// Get order by ID
const getOrderById = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
};

// Update order status (admin only)
const updateOrderStatus = async (id, status, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${id}`, { status }, config);
  return response.data;
};

// Place new order
const placeOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, orderData, config);
  return response.data;
};

const orderService = {
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  placeOrder,
};

export default orderService;
