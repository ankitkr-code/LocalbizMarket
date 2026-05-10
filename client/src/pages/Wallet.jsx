import { ArrowDownLeft, ArrowUpRight, IndianRupee } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { useWallet } from "../hooks/useWallet.js";

export default function Wallet() {
  const [amount, setAmount] = useState("10000");
  const [status, setStatus] = useState("");
  const { firebaseUser, getToken } = useAuth();
  const { error, isLoading, reload, wallet } = useWallet();
  const balance = Number(wallet?.balance || 0);
  const transactions = [...(wallet?.transactions || [])].reverse();

  async function handleAddFunds(event) {
    event.preventDefault();
    setStatus("Adding funds...");

    try {
      const response = await api(`/wallets/${firebaseUser?.uid}/add-funds`, {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) }),
        getToken
      });
      setStatus(`Added Rs. ${Number(amount).toLocaleString("en-IN")} to your wallet.`);
      await reload();
      setAmount("10000");
      return response.wallet;
    } catch (requestError) {
      setStatus(requestError.message);
      return null;
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-600">Available balance</p>
        <div className="mt-3 flex items-center gap-2 text-4xl font-bold">
          <IndianRupee size={32} /> {isLoading ? "..." : balance.toLocaleString("en-IN")}
        </div>
        {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form className="mt-6 grid gap-3" onSubmit={handleAddFunds}>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Add funds amount</span>
            <input className="field" type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </label>
          <div className="flex gap-3">
            <button className="btn-primary flex items-center gap-2" type="submit">
              <ArrowDownLeft size={17} /> Add funds
            </button>
            <Link className="btn-secondary flex items-center gap-2" to="/businesses">
              <ArrowUpRight size={17} /> Invest
            </Link>
          </div>
        </form>
        {status && <p className="mt-4 rounded bg-emerald-50 p-3 text-sm text-emerald-800">{status}</p>}
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="section-title">Wallet Activity</h1>
        {!isLoading && transactions.length === 0 && (
          <p className="mt-4 rounded bg-slate-50 p-3 text-sm text-slate-600">No wallet activity yet.</p>
        )}
        <div className="mt-4 divide-y divide-slate-100">
          {transactions.map((tx, index) => (
            <div key={`${tx.createdAt}-${index}`} className="flex items-center justify-between py-3">
              <span className="font-medium">{tx.label}</span>
              <span className={tx.type === "credit" ? "font-semibold text-leaf" : "font-semibold text-clay"}>
                {tx.type === "credit" ? "+" : "-"}Rs. {Number(tx.amount || 0).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
