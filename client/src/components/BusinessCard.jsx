import { MapPin, Star, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function BusinessCard({ business, onInvest }) {
  const fundingGoal = Number(business.fundingGoal || 0);
  const funded = Number(business.funded || 0);
  const percent = fundingGoal > 0 ? Math.round((funded / fundingGoal) * 100) : 0;
  const progressWidth = Math.min(percent, 100);
  const rating = business.rating || "New";
  const monthlyViews = business.monthlyViews || 0;
  const [amount, setAmount] = useState("1000");
  const [status, setStatus] = useState("");

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
    </article>
  );
}
