import { Upload } from "lucide-react";
import { useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

const initialForm = {
  businessId: "",
  amount: "",
  receiptNumber: "",
  notes: "",
  receiptFile: null
};

export default function UploadPurchase() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [fileName, setFileName] = useState("");
  const { getToken } = useAuth();

  function updateField(event) {
    const { name, value, files } = event.target;
    if (name === "receiptFile") {
      setForm(current => ({ ...current, [name]: files?.[0] || null }));
      setFileName(files?.[0]?.name || "");
    } else {
      setForm(current => ({ ...current, [name]: value }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (!form.businessId || !form.amount || !form.receiptNumber) {
      setStatus("Please fill in all required fields");
      return;
    }
    
    setStatus("Uploading purchase receipt...");

    try {
      const response = await api("/purchases", {
        method: "POST",
        body: JSON.stringify({
          businessId: form.businessId,
          amount: Number(form.amount),
          receiptNumber: form.receiptNumber,
          notes: form.notes
        }),
        getToken
      });
      setStatus(`✓ Receipt ${response.purchase.receiptNumber} uploaded successfully. Awaiting admin verification.`);
      setForm(initialForm);
      setFileName("");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="section-title">Upload Purchase Receipt</h1>
      <p className="mt-2 text-slate-600">Submit receipts for your business purchases. Admin will verify and confirm.</p>
      
      <form className="mt-5 grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Business <span className="text-red-500">*</span></span>
          <input
            className="field"
            name="businessId"
            value={form.businessId}
            onChange={updateField}
            placeholder="Enter business ID"
            required
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Amount (Rs.) <span className="text-red-500">*</span></span>
            <input
              className="field"
              name="amount"
              type="number"
              min="1"
              value={form.amount}
              onChange={updateField}
              placeholder="5000"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Receipt Number <span className="text-red-500">*</span></span>
            <input
              className="field"
              name="receiptNumber"
              value={form.receiptNumber}
              onChange={updateField}
              placeholder="LM-2024-001"
              required
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Receipt File (Image/PDF)</span>
          <div className="relative">
            <input
              className="field cursor-pointer opacity-0 absolute inset-0"
              type="file"
              name="receiptFile"
              accept="image/*,.pdf"
              onChange={updateField}
            />
            <div className="field flex items-center justify-between bg-slate-50 border-2 border-dashed">
              <span className="text-slate-600">{fileName || "Choose file or drag & drop"}</span>
              <Upload size={20} className="text-slate-400" />
            </div>
          </div>
          <p className="text-xs text-slate-500">JPG, PNG, or PDF (Max 5MB)</p>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Notes</span>
          <textarea
            className="field min-h-20"
            name="notes"
            value={form.notes}
            onChange={updateField}
            placeholder="Additional details about this purchase..."
          />
        </label>

        <button className="btn-primary justify-self-start" type="submit">
          Upload Receipt
        </button>
        
        {status && (
          <p className={`rounded p-3 text-sm ${status.includes("✓") ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-700"}`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
