import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function RequireAuth({ children, roles }) {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (roles?.length && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
