import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export function useActivityProofs() {
  const { getToken, role } = useAuth();
  const [claims, setClaims] = useState([]);
  const [confirmations, setConfirmations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(role === "admin");

  const loadProofs = useCallback(async () => {
    if (role !== "admin") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await api("/activity/proofs", { getToken });
      setClaims(response.claims || []);
      setConfirmations(response.confirmations || []);
      setAuditLogs(response.auditLogs || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, role]);

  useEffect(() => {
    loadProofs();
  }, [loadProofs]);

  return { auditLogs, claims, confirmations, error, isLoading, reload: loadProofs };
}
