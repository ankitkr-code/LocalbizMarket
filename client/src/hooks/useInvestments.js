import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export function useInvestments() {
  const { getToken, isAuthenticated } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadInvestments = useCallback(async () => {
    if (!isAuthenticated) {
      setInvestments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await api("/investments", { getToken });
      setInvestments(response.investments || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isAuthenticated]);

  useEffect(() => {
    loadInvestments();
  }, [loadInvestments]);

  const totalAmount = useMemo(
    () => investments.reduce((sum, investment) => sum + Number(investment.amount || 0), 0),
    [investments]
  );

  return { error, investments, isLoading, reload: loadInvestments, totalAmount };
}
