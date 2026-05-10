import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import BusinessCard from "../components/BusinessCard.jsx";
import { useBusinesses } from "../hooks/useBusinesses.js";

export default function InvestorDashboard() {
  const { getToken } = useAuth();
  const { businesses, error, isLoading, reload } = useBusinesses();

  async function handleInvest(businessId, amount) {
    await api("/investments", {
      method: "POST",
      body: JSON.stringify({ businessId, amount }),
      getToken
    });
    await reload();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="section-title">Investor Panel</h1>
          <p className="mt-2 text-slate-600">Discover approved businesses, manage your wallet, and track investments.</p>
        </div>
        <Link className="btn-primary" to="/wallet">Open wallet</Link>
      </div>
      {isLoading && <p className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">Loading investment opportunities...</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-5 text-red-700">{error}</p>}
      {!isLoading && !error && businesses.length === 0 && (
        <p className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">No approved opportunities yet.</p>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} onInvest={handleInvest} />
        ))}
      </div>
    </div>
  );
}
