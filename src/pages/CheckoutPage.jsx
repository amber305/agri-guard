import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaLock, FaTruck, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import Navbar from '../components/Shared/Navbar';
import Footer from '../components/Footer';
import orderService from '../services/orderService';

const PAYMENT_METHODS = [
  { id: 'COD', name: 'Cash on Delivery', icon: FaMoneyBillWave },
  { id: 'CARD', name: 'Credit/Debit Card', icon: FaCreditCard }
];

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const validateShipping = () => {
    const required = ['name', 'address', 'city', 'state', 'postalCode', 'country', 'phone'];
    const missing = required.filter(field => !shipping[field]);
    if (missing.length > 0) {
      setError(`Please fill in all required fields: ${missing.join(', ')}`);
      return false;
    }
    if (!/^\d{10}$/.test(shipping.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError(null);
    if (step === 1 && !validateShipping()) {
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    setError(null);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateShipping()) return;
    
    if (!token) {
      setError('Please log in to place an order');
      navigate('/auth/signin');
      return;
    }
    
    setPlacingOrder(true);
    setError(null);

    try {
      // Prepare order data
      const orderData = {
        products: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          name: shipping.name,
          street: shipping.address,
          city: shipping.city,
          state: shipping.state,
          postalCode: shipping.postalCode,
          country: shipping.country,
          phone: shipping.phone
        },
        paymentMethod,
        totalPrice: cartTotal
      };

      // Use orderService to place order with the token
      const data = await orderService.placeOrder(orderData, token);

      if (!data) {
        throw new Error('No response data received from server');
      }

      setOrderDetails(data);
      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      console.error('Error placing order:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to place order. Please try again.';
      setError(errorMessage);
      
      // If the error is due to insufficient stock, show which products are out of stock
      if (err.response?.data?.message?.includes('Insufficient stock')) {
        const productName = err.response.data.message.split('for ')[1];
        setError(`Sorry, ${productName} is out of stock. Please update your cart and try again.`);
      }
      
      // If token is invalid, redirect to login
      if (err.response?.status === 401) {
        navigate('/auth/signin');
      }
      
      setStep(1); // Go back to shipping step on error
    } finally {
      setPlacingOrder(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-32 pb-12 flex flex-col items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-full border-t-8 border-green-500 animate-fade-in">
            <svg className="mx-auto mb-4" width="48" height="48" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#22c55e"/>
              <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Order Placed Successfully!</h2>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Order Tracking Number:</p>
              <p className="font-mono text-lg font-bold text-green-700">{orderDetails?.trackingNumber}</p>
            </div>
            <p className="text-gray-700 my-6">Thank you for your purchase. We'll send you an email with order details.</p>
            <div className="space-y-3">
              <button
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                onClick={() => navigate('/orders')}
              >
                View Order Details
              </button>
              <button
                className="w-full bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors border border-green-600"
                onClick={() => navigate('/marketplace')}
              >
                Continue Shopping
              </button>
            </div>
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
            <span className={`font-semibold ${step >= 1 ? 'text-green-700' : 'text-gray-400'}`}>Shipping</span>
            <span className={`font-semibold ${step >= 2 ? 'text-green-700' : 'text-gray-400'}`}>Payment</span>
            <span className={`font-semibold ${step >= 3 ? 'text-green-700' : 'text-gray-400'}`}>Review</span>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full">
            <div 
              className="h-2 bg-green-500 rounded-full transition-all duration-500" 
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 animate-fade-in">
                {error}
              </div>
            )}

            {/* Shipping Form */}
            {step === 1 && (
              <form className="bg-white rounded-2xl shadow-xl p-8 border border-green-100 animate-fade-in">
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
                    <label className="block text-gray-700 mb-1 font-medium">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shipping.phone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
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
                    <div>
                      <label className="block text-gray-700 mb-1 font-medium">State</label>
                      <input
                        type="text"
                        name="state"
                        value={shipping.state}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
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
                </div>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full mt-8 bg-green-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </form>
            )}

            {/* Payment Method Selection */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100 animate-fade-in">
                <h2 className="text-2xl font-bold text-green-800 mb-6">Payment Method</h2>
                <div className="space-y-4">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="hidden"
                      />
                      <div className="flex items-center flex-1">
                        <method.icon className={`h-6 w-6 ${
                          paymentMethod === method.id ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <span className="ml-3 font-medium">{method.name}</span>
                      </div>
                      {paymentMethod === method.id && (
                        <div className="h-4 w-4 rounded-full bg-green-500 border-4 border-white"></div>
                      )}
                    </label>
                  ))}
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Order Review */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100 animate-fade-in">
                <h2 className="text-2xl font-bold text-green-800 mb-6">Review Your Order</h2>
                
                {/* Shipping Details */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Shipping Details</h3>
                  <p className="text-gray-600">{shipping.name}</p>
                  <p className="text-gray-600">{shipping.address}</p>
                  <p className="text-gray-600">
                    {shipping.city}, {shipping.state} {shipping.postalCode}
                  </p>
                  <p className="text-gray-600">{shipping.country}</p>
                  <p className="text-gray-600">Phone: {shipping.phone}</p>
                </div>

                {/* Payment Method */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Payment Method</h3>
                  <p className="text-gray-600">
                    {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name}
                  </p>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {placingOrder ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Placing Order...
                      </span>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100 animate-fade-in flex flex-col h-fit">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Order Summary</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <>
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
                <div className="space-y-2 py-4 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-8 space-y-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaLock className="h-4 w-4 mr-2 text-green-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center">
                    <FaTruck className="h-4 w-4 mr-2 text-green-500" />
                    <span>Free Delivery</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage; 