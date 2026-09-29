import { BarChart3, CheckCircle2, Clock, Users } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useActivityProofs } from "../hooks/useActivityProofs.js";
import { useAdminStats } from "../hooks/useAdminStats.js";
import { useBusinesses } from "../hooks/useBusinesses.js";
import { useInvestments } from "../hooks/useInvestments.js";

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const { error: statsError, isLoading: statsLoading, stats } = useAdminStats();
  const { businesses, error, isLoading, reload } = useBusinesses();
  const {
    auditLogs,
    claims,
    confirmations,
    error: proofsError,
    isLoading: proofsLoading,
    reload: reloadProofs
  } = useActivityProofs();
  const {
    error: investmentsError,
    investments,
    isLoading: investmentsLoading,
    totalAmount
  } = useInvestments();
  const pendingBusinesses = businesses.filter((business) => business.status === "pending");
  const pendingProofs = [
    ...claims.filter((claim) => claim.status === "submitted").map((claim) => ({ ...claim, type: "salesClaims", label: "Sales claim" })),
    ...confirmations.filter((confirmation) => confirmation.status === "submitted").map((confirmation) => ({ ...confirmation, type: "qrConfirmations", label: "QR confirmation" }))
  ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const recentInvestments = [...investments]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);
  const statCards = [
    { label: "Users", value: statsLoading ? "..." : String(stats?.counts?.users || 0) },
    { label: "Businesses", value: statsLoading ? "..." : String(stats?.counts?.businesses || 0) },
    { label: "Purchases", value: statsLoading ? "..." : String(stats?.counts?.purchases || 0) },
    { label: "Pending proofs", value: statsLoading ? "..." : String(stats?.counts?.pendingProofs || 0) }
  ];

  async function handleReview(id, status) {
    await api(`/businesses/${id}/review`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      getToken
    });
    await reload();
  }

  async function handleProofReview(proof, status) {
    const reason = window.prompt(`Reason for marking this proof ${status}`);
    if (reason === null) return;

    await api(`/activity/proofs/${proof.type}/${proof.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, reason }),
      getToken
    });
    await reloadProofs();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="mt-2 text-slate-600">Review users, businesses, purchase uploads, and platform metrics.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
          </div>
        ))}
      </div>
      {statsError && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{statsError}</p>}
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
            <Clock size={20} /> Activity Proof Review
          </h2>
          {proofsLoading && <p className="mt-4 text-sm text-slate-600">Loading activity proofs...</p>}
          {proofsError && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{proofsError}</p>}
          {!proofsLoading && !proofsError && pendingProofs.length === 0 && (
            <p className="mt-4 rounded bg-slate-50 p-3 text-sm text-slate-600">No submitted activity proofs right now.</p>
          )}
          <div className="mt-4 space-y-3">
            {pendingProofs.slice(0, 8).map((proof) => (
              <div key={`${proof.type}-${proof.id}`} className="rounded border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{proof.label}: {proof.businessName}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {proof.type === "salesClaims"
                        ? `Claimed Rs. ${Number(proof.claimedSalesAmount || 0).toLocaleString("en-IN")} from ${Number(proof.claimedCustomerCount || 0)} customers`
                        : `Confirmed Rs. ${Number(proof.amount || 0).toLocaleString("en-IN")} with receipt ${proof.receiptNumber}`}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{proof.createdAt ? new Date(proof.createdAt).toLocaleString() : "Date not available"}</p>
                  </div>
                  <StatusBadge status={proof.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn-primary py-1" type="button" onClick={() => handleProofReview(proof, "verified")}>Verify</button>
                  <button className="btn-secondary py-1" type="button" onClick={() => handleProofReview(proof, "suspicious")}>Suspicious</button>
                  <button className="btn-secondary py-1" type="button" onClick={() => handleProofReview(proof, "rejected")}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <BarChart3 size={20} /> Investment Overview
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded bg-slate-50 p-3">
              <p className="text-2xl font-bold">Rs. {totalAmount.toLocaleString("en-IN")}</p>
              <p className="mt-1 text-sm text-slate-600">Total invested</p>
            </div>
            <div className="rounded bg-slate-50 p-3">
              <p className="text-2xl font-bold">{investments.length}</p>
              <p className="mt-1 text-sm text-slate-600">Investment records</p>
            </div>
          </div>
          {investmentsLoading && <p className="mt-4 text-sm text-slate-600">Loading investments...</p>}
          {investmentsError && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{investmentsError}</p>}
          {!investmentsLoading && !investmentsError && recentInvestments.length === 0 && (
            <p className="mt-4 rounded bg-slate-50 p-3 text-sm text-slate-600">No investments yet.</p>
          )}
          <div className="mt-4 divide-y divide-slate-100">
            {recentInvestments.map((investment) => (
              <div key={investment.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold">{investment.businessName || "Business"}</p>
                  <p className="text-sm text-slate-600">{investment.createdAt ? new Date(investment.createdAt).toLocaleString() : "Date not available"}</p>
                </div>
                <p className="font-semibold">Rs. {Number(investment.amount || 0).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <CheckCircle2 size={20} /> Audit Log
          </h2>
          {auditLogs.length === 0 && <p className="mt-4 rounded bg-slate-50 p-3 text-sm text-slate-600">No audit actions yet.</p>}
          <div className="mt-4 divide-y divide-slate-100">
            {auditLogs.slice(0, 8).map((log) => (
              <div key={log.id} className="py-3">
                <p className="font-semibold">{log.action} - {log.businessName || log.targetType}</p>
                <p className="text-sm text-slate-600">{log.reason || "No reason provided"}</p>
                <p className="text-xs text-slate-500">{log.createdAt ? new Date(log.createdAt).toLocaleString() : "Date not available"}</p>
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
