import { Route, Routes } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth.jsx";
import Shell from "./components/Shell.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Home from "./pages/Home.jsx";
import BusinessPage from "./pages/BusinessPage.jsx";
import Wallet from "./pages/Wallet.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AddBusiness from "./pages/AddBusiness.jsx";
import UploadPurchase from "./pages/UploadPurchase.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/businesses" element={<RequireAuth roles={["investor", "admin"]}><BusinessPage /></RequireAuth>} />
        <Route path="/wallet" element={<RequireAuth roles={["investor"]}><Wallet /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth roles={["admin"]}><AdminDashboard /></RequireAuth>} />
        <Route path="/add-business" element={<RequireAuth roles={["business_owner", "admin"]}><AddBusiness /></RequireAuth>} />
        <Route path="/upload-purchase" element={<RequireAuth roles={["business_owner", "admin"]}><UploadPurchase /></RequireAuth>} />
        <Route path="/chatbot" element={<RequireAuth><Chatbot /></RequireAuth>} />
      </Routes>
    </Shell>
  );
}
