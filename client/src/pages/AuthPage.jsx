import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "investor"
};

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const { firebaseReady, isAuthenticated, isLoading, login, register } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="mx-auto max-w-md rounded-md border border-slate-200 bg-white p-5 shadow-sm">Checking session...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Please wait...");

    try {
      if (mode === "register") {
        await register(form);
      } else {
        await login(form.email, form.password);
      }
      navigate("/dashboard");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="section-title">{mode === "login" ? "Sign In" : "Create Account"}</h1>
      {!firebaseReady && (
        <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Firebase is not configured yet. Add values to `client/.env.local` from your Firebase web app.
        </p>
      )}
      <form className="mt-5 grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
        {mode === "register" && (
          <>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Name</span>
              <input className="field" name="name" value={form.name} onChange={updateField} required />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Account type</span>
              <select className="field" name="role" value={form.role} onChange={updateField}>
                <option value="investor">Investor</option>
                <option value="business_owner">Business Owner</option>
              </select>
              <span className="text-xs text-slate-500">Admin access is assigned manually in Firestore.</span>
            </label>
          </>
        )}
        <label className="grid gap-2">
          <span className="text-sm font-medium">Email</span>
          <input className="field" name="email" value={form.email} onChange={updateField} type="email" required />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Password</span>
          <input className="field" name="password" value={form.password} onChange={updateField} type="password" minLength={6} required />
        </label>
        <button className="btn-primary" type="submit">{mode === "login" ? "Sign in" : "Create account"}</button>
        <button
          className="btn-secondary"
          type="button"
          onClick={() => {
            setStatus("");
            setMode((current) => (current === "login" ? "register" : "login"));
          }}
        >
          {mode === "login" ? "Create a new account" : "Already have an account"}
        </button>
        {status && <p className="rounded bg-slate-50 p-3 text-sm text-slate-700">{status}</p>}
      </form>
    </div>
  );
}
