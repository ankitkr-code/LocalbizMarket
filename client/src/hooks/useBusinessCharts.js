import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export function useBusinessCharts(businessId) {
  const { getToken, isAuthenticated } = useAuth();
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(businessId));

  const loadChartData = useCallback(async () => {
    if (!businessId || !isAuthenticated) {
      setChartData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await api(`/charts/dashboard/business/${businessId}`, { getToken });
      setChartData(response);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [businessId, getToken, isAuthenticated]);

  useEffect(() => {
    loadChartData();
  }, [loadChartData]);

  return { chartData, error, isLoading, reload: loadChartData };
}
