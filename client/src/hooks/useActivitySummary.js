import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

const emptySummary = {
  claimedSalesAmount: 0,
  claimedCustomerCount: 0,
  confirmedRevenue: 0,
  checkIns: 0,
  reviews: 0,
  qrConfirmations: 0,
  customerActivityCount: 0,
  verifiedRevenuePercent: 0,
  activityMatchPercent: 0,
  scoreBreakdown: {
    verifiedRevenuePercent: 0,
    activityMatchPercent: 0,
    suspiciousPenalty: 0,
    rejectedPenalty: 0,
    baseScore: null
  },
  trustScore: null,
  trustStatus: "missing_claim",
  healthBadge: "Needs claim"
};

export function useActivitySummary(businessId) {
  const { getToken, isAuthenticated } = useAuth();
  const [summary, setSummary] = useState(emptySummary);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(businessId));

  const loadSummary = useCallback(async () => {
    if (!businessId || !isAuthenticated) {
      setSummary(emptySummary);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await api(`/activity/businesses/${businessId}/summary`, { getToken });
      setSummary(response.summary || emptySummary);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [businessId, getToken, isAuthenticated]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return { error, isLoading, reload: loadSummary, summary };
}
