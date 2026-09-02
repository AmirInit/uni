import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LoadingBlock } from './ui/Spinner.jsx';

/** Requires a signed-in user; remembers where they were headed. */
export const RequireAuth = () => {
  const { isAuthenticated, initialising } = useAuth();
  const location = useLocation();

  if (initialising) return <LoadingBlock label="در حال بررسی حساب کاربری…" />;

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
};

/** Requires the `admin` role. Non-admins are bounced to the storefront. */
export const RequireAdmin = () => {
  const { isAuthenticated, isAdmin, initialising } = useAuth();
  const location = useLocation();

  if (initialising) return <LoadingBlock label="در حال بررسی سطح دسترسی…" />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

/** Keeps already-signed-in users away from the login/register pages. */
export const RedirectIfAuthenticated = () => {
  const { isAuthenticated, initialising } = useAuth();
  if (initialising) return <LoadingBlock />;
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
