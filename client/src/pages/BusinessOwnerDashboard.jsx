import { Link } from "react-router-dom";
import { useBusinesses } from "../hooks/useBusinesses.js";

function StatusBadge({ status }) {
  const styles = {
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
    pending: "bg-amber-50 text-amber-700"
  };

  return (
    <span className={`rounded px-2 py-1 text-xs font-semibold ${styles[status] || styles.pending}`}>
      {status || "pending"}
    </span>
  );
}

export default function BusinessOwnerDashboard() {
  const { businesses, error, isLoading } = useBusinesses();

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="section-title">Business Owner Panel</h1>
          <p className="mt-2 text-slate-600">Submit businesses, upload purchases, and review funding progress.</p>
        </div>
        <div className="flex gap-3">
          <Link className="btn-primary" to="/add-business">Add business</Link>
          <Link className="btn-secondary" to="/upload-purchase">Upload purchase</Link>
        </div>
      </div>

      {isLoading && <p className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">Loading your businesses...</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-5 text-red-700">{error}</p>}
      {!isLoading && !error && businesses.length === 0 && (
        <p className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">You have not submitted any businesses yet.</p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {businesses.map((business) => (
          <article key={business.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-leaf">{business.category}</p>
                <h2 className="mt-1 text-lg font-semibold">{business.name}</h2>
              </div>
              <StatusBadge status={business.status} />
            </div>
            <p className="mt-2 text-sm text-slate-600">{business.location}</p>
            <p className="mt-4 text-sm text-slate-600">Funding progress</p>
            <p className="text-2xl font-bold">Rs. {Number(business.funded || 0).toLocaleString("en-IN")}</p>
            <p className="mt-2 text-sm text-slate-600">Goal: Rs. {Number(business.fundingGoal || 0).toLocaleString("en-IN")}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
