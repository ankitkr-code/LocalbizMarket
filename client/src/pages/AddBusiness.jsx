import { useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

const initialForm = {
  name: "",
  category: "",
  location: "",
  fundingGoal: "",
  summary: ""
};

export default function AddBusiness() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const { getToken } = useAuth();

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Submitting...");

    try {
      const response = await api("/businesses", {
        method: "POST",
        body: JSON.stringify(form),
        getToken
      });
      setStatus(`${response.business.name} was submitted for admin review.`);
      setForm(initialForm);
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="section-title">Add Business</h1>
      <form className="mt-5 grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Business name</span>
          <input className="field" name="name" value={form.name} onChange={updateField} placeholder="Example: Green Spoon Cafe" required />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Category</span>
            <input className="field" name="category" value={form.category} onChange={updateField} placeholder="Food, retail, service" required />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Location</span>
            <input className="field" name="location" value={form.location} onChange={updateField} placeholder="City" required />
          </label>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Funding goal</span>
          <input className="field" name="fundingGoal" value={form.fundingGoal} onChange={updateField} type="number" placeholder="500000" required />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Business summary</span>
          <textarea className="field min-h-32" name="summary" value={form.summary} onChange={updateField} placeholder="Describe the business, revenue, and growth plan." />
        </label>
        <button className="btn-primary justify-self-start" type="submit">Submit for review</button>
        {status && <p className="rounded bg-slate-50 p-3 text-sm text-slate-700">{status}</p>}
      </form>
    </div>
  );
}
