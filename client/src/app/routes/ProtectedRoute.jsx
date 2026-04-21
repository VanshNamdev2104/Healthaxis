import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner.jsx";

/**
 * Component to protect routes that require authentication.
 * It reads the `isAuthenticated` flag from the auth slice.
 * If the user is authenticated, it renders the nested route via <Outlet />.
 * Otherwise, it redirects to the root (AuthPage).
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // While auth status is being determined (e.g., on app load), show a loading spinner
  if (loading) return <Spinner />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
