import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export function useWallet() {
  const { firebaseUser, getToken, isAuthenticated } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadWallet = useCallback(async () => {
    if (!isAuthenticated || !firebaseUser?.uid) {
      setWallet(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await api(`/wallets/${firebaseUser.uid}`, { getToken });
      setWallet(response.wallet);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [firebaseUser?.uid, getToken, isAuthenticated]);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  return { error, isLoading, reload: loadWallet, wallet };
}
