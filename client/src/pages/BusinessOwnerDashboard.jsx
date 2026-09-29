import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useActivitySummary } from "../hooks/useActivitySummary.js";
import { useBusinesses } from "../hooks/useBusinesses.js";

function OwnerBusinessCard({ business }) {
  const { getToken } = useAuth();
  const { reload, summary } = useActivitySummary(business.id);
  const [claim, setClaim] = useState({ claimedSalesAmount: "", claimedCustomerCount: "", notes: "" });
  const [status, setStatus] = useState("");
  const trustLabel = summary.trustStatus === "ready" ? `${summary.trustScore}/100` : "Need today's claim";
  const badgeStyles = {
    "Strong proof": "bg-emerald-50 text-emerald-700",
    "Growing signal": "bg-sky-50 text-sky-700",
    "Needs review": "bg-orange-50 text-orange-700",
    "Weak proof": "bg-red-50 text-red-700",
    "Needs claim": "bg-amber-50 text-amber-700"
  };

  function updateClaim(event) {
    setClaim((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitClaim(event) {
    event.preventDefault();
    setStatus("Submitting sales claim...");

    try {
      await api("/activity/sales-claims", {
        method: "POST",
        body: JSON.stringify({ ...claim, businessId: business.id }),
        getToken
      });
      setClaim({ claimedSalesAmount: "", claimedCustomerCount: "", notes: "" });
      setStatus("Sales claim submitted.");
      await reload();
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
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

      <div className="mt-4 rounded bg-slate-50 p-3 text-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold">Claimed vs verified</p>
          <span className={`rounded px-2 py-1 text-xs font-semibold ${badgeStyles[summary.healthBadge] || badgeStyles["Needs claim"]}`}>
            {summary.healthBadge}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-slate-600">
          <span>Claimed sales</span>
          <span className="text-right font-medium text-ink">Rs. {Number(summary.claimedSalesAmount || 0).toLocaleString("en-IN")}</span>
          <span>Confirmed revenue</span>
          <span className="text-right font-medium text-ink">Rs. {Number(summary.confirmedRevenue || 0).toLocaleString("en-IN")}</span>
          <span>Customer activity</span>
          <span className="text-right font-medium text-ink">{summary.customerActivityCount}</span>
          <span>Trust score</span>
          <span className="text-right font-medium text-ink">{trustLabel}</span>
          <span>Verified revenue</span>
          <span className="text-right font-medium text-ink">{summary.scoreBreakdown?.verifiedRevenuePercent || 0}%</span>
          <span>Activity match</span>
          <span className="text-right font-medium text-ink">{summary.scoreBreakdown?.activityMatchPercent || 0}%</span>
          <span>Risk penalty</span>
          <span className="text-right font-medium text-ink">-{Number(summary.scoreBreakdown?.suspiciousPenalty || 0) + Number(summary.scoreBreakdown?.rejectedPenalty || 0)}</span>
        </div>
      </div>

      {business.status === "approved" && (
        <form className="mt-4 grid gap-2" onSubmit={submitClaim}>
          <input className="field" name="claimedSalesAmount" type="number" min="1" value={claim.claimedSalesAmount} onChange={updateClaim} placeholder="Claimed sales amount" required />
          <input className="field" name="claimedCustomerCount" type="number" min="1" value={claim.claimedCustomerCount} onChange={updateClaim} placeholder="Claimed customer count" required />
          <textarea className="field min-h-20" name="notes" value={claim.notes} onChange={updateClaim} placeholder="Notes" />
          <button className="btn-primary" type="submit">Submit sales claim</button>
          {status && <p className="rounded bg-slate-50 p-2 text-xs text-slate-700">{status}</p>}
        </form>
      )}
    </article>
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {businesses.map((business) => (
          <OwnerBusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
}
