import { useEffect, useState } from 'react';
import Navbar from '../components/Shared/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TABS = ['Dashboard', 'Products', 'Orders'];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, pendingOrders: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: '', stock: '', category: '', image: '', description: '' });
  const [orderStatusUpdate, setOrderStatusUpdate] = useState({});
  const { token } = useAuth();

  // Fetch products and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [prodRes, ordRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/products`, { headers }),
          fetch(`${API_BASE_URL}/admin/orders`, { headers })
        ]);

        if (!prodRes.ok || !ordRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const products = await prodRes.json();
        const orders = await ordRes.json();
        
        setProducts(products);
        setOrders(orders);
        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          lowStock: products.filter(p => p.stock < 10).length
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, showProductForm, editProduct]);

  // Product CRUD handlers
  const handleProductFormChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      setShowProductForm(false);
      setProductForm({ name: '', price: '', stock: '', category: '', image: '', description: '' });
    } catch (err) {
      setError(err.message);
      console.error('Error adding product:', err);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setProductForm(product);
    setShowProductForm(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${editProduct._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      setEditProduct(null);
      setShowProductForm(false);
      setProductForm({ name: '', price: '', stock: '', category: '', image: '', description: '' });
    } catch (err) {
      setError(err.message);
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting product:', err);
    }
  };

  // Order status update
  const handleOrderStatusChange = (id, status) => {
    setOrderStatusUpdate({ ...orderStatusUpdate, [id]: status });
  };

  const handleUpdateOrderStatus = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: orderStatusUpdate[id] })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      setOrderStatusUpdate({ ...orderStatusUpdate, [id]: '' });
    } catch (err) {
      setError(err.message);
      console.error('Error updating order status:', err);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setOrders(orders.filter(o => o._id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting order:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-32 pb-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-32">
            <h2 className="text-2xl font-bold text-green-700 mb-8">Admin Panel</h2>
            <nav className="flex flex-col gap-4">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab ? 'bg-green-600 text-white' : 'hover:bg-green-100 text-green-800'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="text-green-600 font-bold text-xl">Loading...</span>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button 
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setError(null)}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                  </svg>
                </button>
              </div>
            ) : (
              <>
                {/* Dashboard Overview */}
                {activeTab === 'Dashboard' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                      <span className="text-3xl font-bold text-green-700">{stats.totalProducts}</span>
                      <span className="text-gray-600 mt-2">Products</span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                      <span className="text-3xl font-bold text-green-700">{stats.totalOrders}</span>
                      <span className="text-gray-600 mt-2">Orders</span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                      <span className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</span>
                      <span className="text-gray-600 mt-2">Pending Orders</span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                      <span className="text-3xl font-bold text-red-600">{stats.lowStock}</span>
                      <span className="text-gray-600 mt-2">Low Stock</span>
                    </div>
                  </div>
                )}

                {/* Product Management */}
                {activeTab === 'Products' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-green-800">Products</h2>
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
                        onClick={() => { setShowProductForm(true); setEditProduct(null); setProductForm({ name: '', price: '', stock: '', category: '', image: '', description: '' }); }}
                      >
                        + Add Product
                      </button>
                    </div>
                    {/* Product Form Modal */}
                    {showProductForm && (
                      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative">
                          <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl" onClick={() => { setShowProductForm(false); setEditProduct(null); }}>&times;</button>
                          <h3 className="text-xl font-bold mb-4">{editProduct ? 'Edit Product' : 'Add Product'}</h3>
                          <form onSubmit={editProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                            <input type="text" name="name" value={productForm.name} onChange={handleProductFormChange} placeholder="Name" required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                            <input type="number" name="price" value={productForm.price} onChange={handleProductFormChange} placeholder="Price" required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                            <input type="number" name="stock" value={productForm.stock} onChange={handleProductFormChange} placeholder="Stock" required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                            <input type="text" name="category" value={productForm.category} onChange={handleProductFormChange} placeholder="Category" required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                            <input type="text" name="image" value={productForm.image} onChange={handleProductFormChange} placeholder="Image URL" required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                            <textarea name="description" value={productForm.description} onChange={handleProductFormChange} placeholder="Description" required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">{editProduct ? 'Update' : 'Add'}</button>
                          </form>
                        </div>
                      </div>
                    )}
                    {/* Product Table */}
                    <div className="overflow-x-auto rounded-xl shadow">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr className="bg-green-100 text-green-800">
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Price</th>
                            <th className="py-3 px-4 text-left">Stock</th>
                            <th className="py-3 px-4 text-left">Category</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(product => (
                            <tr key={product._id} className="border-b">
                              <td className="py-2 px-4">{product.name}</td>
                              <td className="py-2 px-4">₹{product.price}</td>
                              <td className="py-2 px-4">{product.stock}</td>
                              <td className="py-2 px-4">{product.category}</td>
                              <td className="py-2 px-4 flex gap-2">
                                <button className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500" onClick={() => handleEditProduct(product)}>Edit</button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Order Management */}
                {activeTab === 'Orders' && (
                  <div>
                    <h2 className="text-2xl font-bold text-green-800 mb-6">Orders</h2>
                    <div className="overflow-x-auto rounded-xl shadow">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr className="bg-green-100 text-green-800">
                            <th className="py-3 px-4 text-left">Order ID</th>
                            <th className="py-3 px-4 text-left">User</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Total</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(order => (
                            <tr key={order._id} className="border-b">
                              <td className="py-2 px-4">{order._id}</td>
                              <td className="py-2 px-4">{order.user ? order.user.name : 'Guest'}</td>
                              <td className="py-2 px-4">
                                <select
                                  value={orderStatusUpdate[order._id] || order.status}
                                  onChange={e => handleOrderStatusChange(order._id, e.target.value)}
                                  className="border border-gray-300 rounded px-2 py-1"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <button
                                  className="ml-2 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                  onClick={() => handleUpdateOrderStatus(order._id)}
                                >
                                  Update
                                </button>
                              </td>
                              <td className="py-2 px-4">₹{order.totalPrice || 0}</td>
                              <td className="py-2 px-4 flex gap-2">
                                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDeleteOrder(order._id)}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard; 