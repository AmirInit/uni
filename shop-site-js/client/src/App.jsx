import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import {
  RedirectIfAuthenticated,
  RequireAdmin,
  RequireAuth,
} from './components/RouteGuards.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import AdminPage from './pages/AdminPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

/**
 * Provider order matters: Cart depends on Auth (to know whose cart to load) and
 * both depend on Toast (to report failures).
 */
export const App = () => (
  <ToastProvider>
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />

            {/* Guests only */}
            <Route element={<RedirectIfAuthenticated />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Signed-in users */}
            <Route element={<RequireAuth />}>
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Admins only */}
            <Route element={<RequireAdmin />}>
              <Route path="admin" element={<AdminPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  </ToastProvider>
);

export default App;
