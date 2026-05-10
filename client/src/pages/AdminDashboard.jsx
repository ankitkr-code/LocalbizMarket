import { BarChart3, CheckCircle2, Clock, Users } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { stats } from "../data/mock.js";
import { useBusinesses } from "../hooks/useBusinesses.js";

function StatusBadge({ status }) {
  const styles = {
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
    pending: "bg-amber-50 text-amber-700"
  };

  return <span className={`rounded px-2 py-1 text-xs font-semibold ${styles[status] || styles.pending}`}>{status || "pending"}</span>;
}

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const { businesses, error, isLoading, reload } = useBusinesses();
  const pendingBusinesses = businesses.filter((business) => business.status === "pending");

  async function handleReview(id, status) {
    await api(`/businesses/${id}/review`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      getToken
    });
    await reload();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="mt-2 text-slate-600">Review users, businesses, purchase uploads, and platform metrics.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Clock size={20} /> Pending Business Reviews
          </h2>
          {isLoading && <p className="mt-4 text-sm text-slate-600">Loading reviews...</p>}
          {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {!isLoading && !error && pendingBusinesses.length === 0 && (
            <p className="mt-4 rounded bg-slate-50 p-3 text-sm text-slate-600">No pending businesses right now.</p>
          )}
          <div className="mt-4 space-y-3">
            {pendingBusinesses.map((business) => (
              <div key={business.id} className="rounded border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{business.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{business.category} in {business.location}</p>
                    <p className="mt-1 text-sm text-slate-600">Goal: Rs. {Number(business.fundingGoal || 0).toLocaleString("en-IN")}</p>
                  </div>
                  <StatusBadge status={business.status} />
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="btn-primary py-1" type="button" onClick={() => handleReview(business.id, "approved")}>
                    Approve
                  </button>
                  <button className="btn-secondary py-1" type="button" onClick={() => handleReview(business.id, "rejected")}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <BarChart3 size={20} /> Data Services
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["users", "wallets", "businesses", "investments", "purchases", "ratingsData", "viewsData"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded bg-slate-50 p-3">
                <CheckCircle2 size={18} className="text-leaf" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <Users size={16} /> Admin access is assigned in Firestore, not through public signup.
          </p>
        </section>
      </div>
    </div>
  );
}
