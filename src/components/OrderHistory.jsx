import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaFilter, FaSort, FaSearch } from 'react-icons/fa';
import Navbar from './Shared/Navbar';
import Footer from './Footer';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: FaBox,
      label: 'Pending'
    },
    processing: {
      color: 'bg-blue-100 text-blue-800',
      icon: FaBox,
      label: 'Processing'
    },
    shipped: {
      color: 'bg-purple-100 text-purple-800',
      icon: FaTruck,
      label: 'Shipped'
    },
    delivered: {
      color: 'bg-green-100 text-green-800',
      icon: FaCheckCircle,
      label: 'Delivered'
    },
    cancelled: {
      color: 'bg-red-100 text-red-800',
      icon: FaTimesCircle,
      label: 'Cancelled'
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get('/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const ordersArray = Array.isArray(data) ? data : [];
        setOrders(ordersArray);
        setFilteredOrders(ordersArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || 'Failed to fetch orders');
        setOrders([]);
        setFilteredOrders([]);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  useEffect(() => {
    let result = [...orders];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(order => 
        order._id.toLowerCase().includes(searchLower) ||
        order.trackingNumber?.toLowerCase().includes(searchLower) ||
        order.products.some(item => 
          item.product.name.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest':
        result.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case 'lowest':
        result.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
      default:
        break;
    }

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, sortBy]);

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-32 pb-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-32 pb-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center max-w-2xl mx-auto">
            <p>{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Order History</h1>
            
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white w-full sm:w-64"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Status</option>
                    {Object.keys(statusConfig).map(status => (
                      <option key={status} value={status}>
                        {statusConfig[status].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Amount</option>
                    <option value="lowest">Lowest Amount</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <FaBox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Found</h2>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Your order history will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-4">
                          <h2 className="text-xl font-semibold text-gray-800">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </h2>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-sm text-gray-600 mt-1">
                            Tracking: <span className="font-mono">{order.trackingNumber}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold text-gray-800">
                          ₹{order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.products.map((item) => (
                        <div key={item._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-800">
                              ₹{(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Details */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                      {/* Shipping Address */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
                        <div className="text-gray-800">
                          <p>{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                          {order.shippingAddress.phone && (
                            <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
                          )}
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Details</h3>
                        <div className="text-gray-800">
                          <p>Method: {order.paymentMethod}</p>
                          <p>Status: {order.paymentStatus}</p>
                          {order.estimatedDelivery && (
                            <p className="mt-1">
                              Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderHistory; 