import { GoogleOAuthProvider } from '@react-oauth/google';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AboutUs from './pages/AboutUs';
import AuthPage from './pages/AuthPage';
import DiseaseDetection from './pages/DiseaseDetection';
import Home from './pages/Home';
import MarketplacePage from './pages/MarketplacePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboard';

const clientId = '445921415562-m37dlhlaes3pp4dd23qf2tre1esavt9v.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/detection" element={<DiseaseDetection />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthPage />}>
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;