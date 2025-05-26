import AOS from 'aos';
import 'aos/dist/aos.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import FilterBar from '../components/Marketplace/FilterBar';
import ProductCard from '../components/Marketplace/ProductCard';
import Loader from '../components/Shared/Loader';
import Navbar from '../components/Shared/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../services/productService';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSpinner } from 'react-icons/fa';
import CartDrawer from '../components/Marketplace/CartDrawer';

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    search: '',
    sortBy: 'name-asc'
  });
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out',
      offset: 100
    });
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(filters);
        console.log('Fetched products:', data);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters]);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    addToCart({ ...product, _id: product._id, quantity: 1 });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      search: '',
      sortBy: 'name-asc'
    });
  };

  if (error) return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <Navbar user={user} />
      <div className="container mx-auto px-4 py-24 text-center flex-grow">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <Navbar user={user} />
      
      <main className="flex-grow container mx-auto px-4 pt-32 pb-12">
        {/* Hero Section */}
        <motion.section 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4" data-aos="fade-up">
            AgriGuard Marketplace
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Discover premium organic solutions for your crops. Quality products sourced directly from trusted farmers worldwide.
          </p>
        </motion.section>

        {/* Filter Bar */}
        <motion.div 
          data-aos="fade-up" 
          data-aos-delay="200"
          className="mb-12 relative z-30"
        >
          <FilterBar
            filters={filters}
            setFilters={setFilters}
          />
        </motion.div>

        {/* Products Grid */}
        <div className="relative z-10">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="w-8 h-8 text-green-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No products found matching your criteria.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* Value Proposition Section */}
      <motion.section 
        className="bg-green-800 text-white py-16"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose AgriGuard?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Quality Guaranteed",
                desc: "All products verified for organic certification and effectiveness",
                icon: "✅"
              },
              {
                title: "Farmer Direct",
                desc: "Support local farmers by buying directly from source",
                icon: "👨‍🌾"
              },
              {
                title: "Sustainable Solutions",
                desc: "Eco-friendly products for healthier crops and environment",
                icon: "🌱"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-green-700/30 p-6 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.03 }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-green-100">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Cart Drawer */}
      <CartDrawer />

      <Footer />
    </div>
  );
};

export default MarketplacePage;