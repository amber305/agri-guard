import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingBag, FaTrash } from 'react-icons/fa';
import Footer from '../components/Footer';
import Navbar from '../components/Shared/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth/signin');
    }
  }, [isAuthenticated, navigate]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center">
            <FaShoppingBag className="mx-auto h-16 w-16 text-gray-400 mt-32 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to your cart to see them here</p>
            <Link
              to="/marketplace"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <FaArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-[150px] pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-6 flex items-center"
                      >
                        {/* Product Image */}
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="ml-6 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <FaTrash className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="px-2 py-1 border border-gray-200 rounded-l-lg hover:bg-gray-50 disabled:opacity-50"
                              >
                                -
                              </button>
                              <span className="px-4 py-1 border-t border-b border-gray-200">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 border border-gray-200 rounded-r-lg hover:bg-gray-50"
                              >
                                +
                              </button>
                            </div>
                            <p className="text-lg font-medium text-gray-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-lg font-medium text-gray-900">₹{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage; 