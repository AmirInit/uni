import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CartDrawer from '../CartDrawer.jsx';
import Toaster from '../Toaster.jsx';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

/** Scrolls back to the top on every navigation — routers don't do this by default. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

export const Layout = () => (
  <div className="flex min-h-screen flex-col">
    <ScrollToTop />
    <Navbar />

    <main className="flex-1">
      <Outlet />
    </main>

    <Footer />
    <CartDrawer />
    <Toaster />
  </div>
);

export default Layout;
