import { MapPin, Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { useActivitySummary } from "../hooks/useActivitySummary.js";
import { getHealthBadgeClass } from "../utils/badgeStyles.js";

export default function BusinessCard({ business, onInvest, onViewAnalytics }) {
  const { getToken } = useAuth();
  const { reload: reloadActivity, summary } = useActivitySummary(business.id);
  const fundingGoal = Number(business.fundingGoal || 0);
  const funded = Number(business.funded || 0);
  const percent = fundingGoal > 0 ? Math.round((funded / fundingGoal) * 100) : 0;
  const progressWidth = Math.min(percent, 100);
  const rating = business.rating || "New";
  const monthlyViews = business.monthlyViews || 0;
  const [amount, setAmount] = useState("1000");
  const [purchaseAmount, setPurchaseAmount] = useState("250");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [status, setStatus] = useState("");
  const trustLabel = summary.trustStatus === "ready" ? `${summary.trustScore}/100` : "Need claim";

  function handleDetails() {
    window.alert(
      `${business.name}\n\nCategory: ${business.category}\nLocation: ${business.location}\nFunding: ${percent}% complete`
    );
  }

  async function handleInvest(event) {
    event.preventDefault();
    if (!onInvest) {
      handleDetails();
      return;
    }

    setStatus("Investing...");
    try {
      await onInvest(business.id, Number(amount));
      setStatus(`Invested Rs. ${Number(amount).toLocaleString("en-IN")}.`);
      setAmount("1000");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleCheckIn() {
    setStatus("Checking in...");
    try {
      await api("/activity/check-ins", {
        method: "POST",
        body: JSON.stringify({ businessId: business.id }),
        getToken
      });
      await reloadActivity();
      setStatus("Check-in recorded.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handlePurchaseConfirmation() {
    setStatus("Confirming purchase...");
    try {
      await api("/activity/qr-confirmations", {
        method: "POST",
        body: JSON.stringify({ businessId: business.id, amount: Number(purchaseAmount), receiptNumber }),
        getToken
      });
      await reloadActivity();
      setReceiptNumber("");
      setStatus("Purchase confirmation recorded.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleReview() {
    const text = window.prompt("Write a short review for this business");
    if (!text) return;

    setStatus("Submitting review...");
    try {
      await api("/activity/reviews", {
        method: "POST",
        body: JSON.stringify({ businessId: business.id, rating: 5, text }),
        getToken
      });
      await reloadActivity();
      setStatus("Review recorded.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-leaf">{business.category}</p>
          <h3 className="mt-1 text-lg font-semibold">{business.name}</h3>
        </div>
        <span className="flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-sm font-medium text-amber-700">
          <Star size={15} fill={business.rating ? "currentColor" : "none"} /> {rating}
        </span>
      </div>
      <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
        <MapPin size={15} /> {business.location}
      </p>
      <div className="mt-4">
        <div className="flex justify-between text-sm">
          <span>Funded</span>
          <span className="font-semibold">{percent}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-leaf" style={{ width: `${progressWidth}%` }} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>Rs. {funded.toLocaleString("en-IN")} raised</span>
        <span className="flex items-center gap-1">
          <TrendingUp size={15} /> {monthlyViews} views
        </span>
      </div>
      <div className="mt-4 rounded bg-slate-50 p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Trust score</span>
          <span className="font-semibold">{trustLabel}</span>
        </div>
        <span className={`mt-2 inline-block rounded px-2 py-1 text-xs font-semibold ${getHealthBadgeClass(summary.healthBadge)}`}>
          {summary.healthBadge}
        </span>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
          <span>Claimed sales</span>
          <span className="text-right">Rs. {Number(summary.claimedSalesAmount || 0).toLocaleString("en-IN")}</span>
          <span>Confirmed</span>
          <span className="text-right">Rs. {Number(summary.confirmedRevenue || 0).toLocaleString("en-IN")}</span>
          <span>Check-ins</span>
          <span className="text-right">{summary.checkIns}</span>
          <span>Reviews</span>
          <span className="text-right">{summary.reviews}</span>
          <span>Verified revenue</span>
          <span className="text-right">{summary.scoreBreakdown?.verifiedRevenuePercent || 0}%</span>
          <span>Activity match</span>
          <span className="text-right">{summary.scoreBreakdown?.activityMatchPercent || 0}%</span>
          <span>Risk penalty</span>
          <span className="text-right">-{Number(summary.scoreBreakdown?.suspiciousPenalty || 0) + Number(summary.scoreBreakdown?.rejectedPenalty || 0)}</span>
        </div>
      </div>
      {onInvest ? (
        <form className="mt-4 grid gap-2" onSubmit={handleInvest}>
          <input className="field" type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} />
          <button className="btn-primary w-full" type="submit">Invest now</button>
          {status && <p className="rounded bg-slate-50 p-2 text-xs text-slate-700">{status}</p>}
        </form>
      ) : (
        <button className="btn-primary mt-4 w-full" type="button" onClick={handleDetails}>
          View investment details
        </button>
      )}
      {onViewAnalytics && (
        <button className="btn-secondary mt-3 w-full" type="button" onClick={() => onViewAnalytics(business)}>
          View analytics
        </button>
      )}
      {onInvest && (
        <div className="mt-3 grid gap-2">
          <input className="field" type="number" min="1" value={purchaseAmount} onChange={(event) => setPurchaseAmount(event.target.value)} placeholder="Purchase amount" />
          <input className="field" value={receiptNumber} onChange={(event) => setReceiptNumber(event.target.value)} placeholder="Receipt or QR code" />
          <div className="grid gap-2 sm:grid-cols-3">
            <button className="btn-secondary px-2" type="button" onClick={handleCheckIn}>Check in</button>
            <button className="btn-secondary px-2" type="button" onClick={handlePurchaseConfirmation}>Confirm</button>
            <button className="btn-secondary px-2" type="button" onClick={handleReview}>Review</button>
          </div>
        </div>
      )}
    </article>
  );
}
