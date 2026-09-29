import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export function useAdminStats() {
  const { getToken, role, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(role === "admin" || role === "investor");

  const loadStats = useCallback(async () => {
    if (!isAuthenticated || (role !== "admin" && role !== "investor")) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await api("/charts/dashboard", { getToken });
      setStats(response);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, role, isAuthenticated]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { error, isLoading, reload: loadStats, stats };
}
