import { useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

const initialForm = {
  businessId: "b1",
  amount: "",
  receiptNumber: "",
  notes: ""
};

export default function UploadPurchase() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const { firebaseUser, getToken } = useAuth();

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Uploading...");

    try {
      const response = await api("/purchases", {
        method: "POST",
        body: JSON.stringify({ ...form, userId: firebaseUser?.uid }),
        getToken
      });
      setStatus(`Purchase ${response.purchase.receiptNumber} is pending admin validation.`);
      setForm(initialForm);
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="section-title">Upload Purchase</h1>
      <form className="mt-5 grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Business ID</span>
          <input className="field" name="businessId" value={form.businessId} onChange={updateField} placeholder="b1" required />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Purchase amount</span>
            <input className="field" name="amount" value={form.amount} onChange={updateField} type="number" placeholder="2500" required />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Receipt number</span>
            <input className="field" name="receiptNumber" value={form.receiptNumber} onChange={updateField} placeholder="LM-204" required />
          </label>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Receipt notes</span>
          <textarea className="field min-h-28" name="notes" value={form.notes} onChange={updateField} placeholder="Add purchase details for admin validation." />
        </label>
        <button className="btn-primary justify-self-start" type="submit">Upload purchase</button>
        {status && <p className="rounded bg-slate-50 p-3 text-sm text-slate-700">{status}</p>}
      </form>
    </div>
  );
}
