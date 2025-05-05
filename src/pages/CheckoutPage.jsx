import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Shared/Navbar';
import Footer from '../components/Footer';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacingOrder(true);
    setTimeout(() => {
      setOrderPlaced(true);
      clearCart();
      setPlacingOrder(false);
    }, 1500);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-32 pb-12 flex flex-col items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-full border-t-8 border-green-500 animate-fade-in">
            <svg className="mx-auto mb-4" width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22c55e"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Order Placed!</h2>
            <p className="text-gray-700 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              onClick={() => navigate('/marketplace')}
            >
              Back to Marketplace
            </button>
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
        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-700 font-semibold">Cart</span>
            <span className="text-green-700 font-semibold">Shipping</span>
            <span className="text-green-700 font-semibold">Review</span>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full">
            <div className="h-2 bg-green-500 rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Shipping Form */}
          <form className="md:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-green-100 animate-fade-in" onSubmit={handlePlaceOrder}>
            <h2 className="text-2xl font-bold text-green-800 mb-6">Shipping Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={shipping.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={shipping.address}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1 font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shipping.city}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1 font-medium">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shipping.postalCode}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Country</label>
                <input
                  type="text"
                  name="country"
                  value={shipping.country}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={placingOrder || cart.length === 0}
              className="w-full mt-8 bg-green-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {placingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100 animate-fade-in flex flex-col h-fit">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Order Summary</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <ul className="divide-y divide-gray-200 mb-4">
                {cart.map((item) => (
                  <li key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <span className="ml-2 text-gray-500 text-sm">x{item.quantity}</span>
                    </div>
                    <span className="text-gray-900 font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-between font-semibold text-lg mt-4">
              <span>Total:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="mt-8 text-sm text-gray-500 border-t pt-4">
              <div className="flex items-center mb-2">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage; 