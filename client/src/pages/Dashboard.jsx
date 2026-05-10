import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import BusinessOwnerDashboard from "./BusinessOwnerDashboard.jsx";
import InvestorDashboard from "./InvestorDashboard.jsx";

export default function Dashboard() {
  const { role } = useAuth();

  if (role === "admin") return <AdminDashboard />;
  if (role === "business_owner") return <BusinessOwnerDashboard />;
  if (role === "investor") return <InvestorDashboard />;

  return <Navigate to="/auth" replace />;
}
