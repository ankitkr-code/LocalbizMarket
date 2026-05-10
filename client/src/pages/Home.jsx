import { ArrowRight, Building2, ShieldCheck, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import BusinessCard from "../components/BusinessCard.jsx";
import { businesses, stats } from "../data/mock.js";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="grid gap-8 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-clay">Local investment platform</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-normal text-ink md:text-5xl">
            Discover, fund, and grow trusted local businesses.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            LocalbizMarket connects investors, business owners, and admins in one workflow for business discovery,
            wallet-based investments, purchase validation, analytics, and AI support.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/businesses" className="btn-primary inline-flex items-center gap-2">
              Browse businesses <ArrowRight size={17} />
            </Link>
            <Link to="/add-business" className="btn-secondary inline-flex items-center gap-2">
              Add business <Building2 size={17} />
            </Link>
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded border border-slate-200 p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3 rounded bg-emerald-50 p-4 text-emerald-900">
              <WalletCards className="mt-1" size={22} />
              <div>
                <p className="font-semibold">Wallet first</p>
                <p className="text-sm">Track deposits, investments, and balances cleanly.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded bg-orange-50 p-4 text-orange-900">
              <ShieldCheck className="mt-1" size={22} />
              <div>
                <p className="font-semibold">Admin verified</p>
                <p className="text-sm">Review businesses, purchases, and platform activity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="section-title">Featured Businesses</h2>
          <Link to="/businesses" className="text-sm font-semibold text-leaf">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </section>
    </div>
  );
}
