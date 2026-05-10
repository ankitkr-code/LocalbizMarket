import { useMemo, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import BusinessCard from "../components/BusinessCard.jsx";
import { useBusinesses } from "../hooks/useBusinesses.js";

export default function BusinessPage() {
  const { getToken } = useAuth();
  const { businesses, error, isLoading, reload } = useBusinesses();
  const [category, setCategory] = useState("All categories");
  const categories = useMemo(
    () => ["All categories", ...new Set(businesses.map((business) => business.category).filter(Boolean))],
    [businesses]
  );
  const visibleBusinesses = category === "All categories"
    ? businesses
    : businesses.filter((business) => business.category === category);

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
          <h1 className="section-title">Business Marketplace</h1>
          <p className="mt-2 text-slate-600">Explore approved local businesses open for investment and growth tracking.</p>
        </div>
        <select className="field max-w-52" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      {isLoading && <p className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">Loading businesses...</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-5 text-red-700">{error}</p>}
      {!isLoading && !error && visibleBusinesses.length === 0 && (
        <p className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">No approved businesses are available yet.</p>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleBusinesses.map((business) => (
          <BusinessCard key={business.id} business={business} onInvest={handleInvest} />
        ))}
      </div>
    </div>
  );
}
