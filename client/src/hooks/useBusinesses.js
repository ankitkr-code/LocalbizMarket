import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export function useBusinesses() {
  const { getToken, isAuthenticated } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadBusinesses = useCallback(async () => {
    if (!isAuthenticated) {
      setBusinesses([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await api("/businesses", { getToken });
      setBusinesses(response.businesses || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isAuthenticated]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  return { businesses, error, isLoading, reload: loadBusinesses };
}
