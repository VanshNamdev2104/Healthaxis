import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

/**
 * Component to protect routes that require authentication.
 * It reads the `isAuthenticated` flag from the auth slice.
 * If the user is authenticated, it renders the nested route via <Outlet />.
 * Otherwise, it redirects to the root (AuthPage).
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // While auth status is being determined (e.g., on app load), we can show nothing or a spinner.
  // For simplicity, render nothing when loading is true.
  if (loading) return null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
