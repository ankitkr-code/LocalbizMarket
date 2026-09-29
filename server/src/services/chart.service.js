import { countCollection, getDocument, listCollection, queryCollection } from "./firestore.service.js";

function formatDateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function buildDateSeries(items, days = 14, dateField = "createdAt") {
  const today = new Date();
  const labels = Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - index - 1));
    return date.toISOString().slice(0, 10);
  });

  const totals = labels.map(() => 0);
  const indexMap = labels.reduce((map, label, index) => {
    map[label] = index;
    return map;
  }, {});

  for (const item of items) {
    const dateKey = formatDateKey(item[dateField] || item.createdAt || new Date().toISOString());
    const index = indexMap[dateKey];
    if (index !== undefined) {
      totals[index] += Number(item.amount || 0);
    }
  }

  return { labels, data: totals };
}

function buildBusinessPerformance(purchases, businesses) {
  const performance = purchases.reduce((map, purchase) => {
    const businessId = purchase.businessId || purchase.business?.id || "unknown";
    const revenue = Number(purchase.amount || 0);
    if (!map[businessId]) {
      map[businessId] = { businessId, businessName: purchase.businessName || "Unknown", revenue: 0 };
    }
    map[businessId].revenue += revenue;
    return map;
  }, {});

  const results = Object.values(performance);
  return results
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map((item) => ({
      ...item,
      revenue: Number(item.revenue.toFixed(0))
    }));
}

export async function getDashboardData() {
  const [businesses, investments, purchases, usersCount, pendingBusinessesCount, submittedClaimsCount, submittedQrCount, ratingsData, viewsData] = await Promise.all([
    listCollection("businesses"),
    listCollection("investments"),
    listCollection("purchases"),
    countCollection("users"),
    countCollection("businesses", [["status", "==", "pending"]]),
    countCollection("salesClaims", [["status", "==", "submitted"]]),
    countCollection("qrConfirmations", [["status", "==", "submitted"]]),
    listCollection("ratingsData"),
    listCollection("viewsData")
  ]);

  const totalInvested = investments.reduce((sum, investment) => sum + Number(investment.amount || 0), 0);
  const totalSales = purchases.reduce((sum, purchase) => sum + Number(purchase.amount || 0), 0);
  const dailySales = buildDateSeries(purchases, 14, "createdAt");
  const dailyInvestments = buildDateSeries(investments, 14, "createdAt");
  const businessPerformance = buildBusinessPerformance(purchases, businesses);

  return {
    counts: {
      users: usersCount,
      businesses: businesses.length,
      investments: investments.length,
      purchases: purchases.length,
      pendingBusinesses: pendingBusinessesCount,
      pendingProofs: submittedClaimsCount + submittedQrCount
    },
    totals: {
      invested: totalInvested,
      sales: totalSales
    },
    dailySales,
    dailyInvestments,
    businessPerformance,
    ratingsData,
    viewsData
  };
}

export async function getBusinessChartData(businessId) {
  const [business, investments, purchases] = await Promise.all([
    getDocument("businesses", businessId),
    queryCollection("investments", [["businessId", "==", businessId]]),
    queryCollection("purchases", [["businessId", "==", businessId]])
  ]);

  if (!business) {
    throw Object.assign(new Error("Business not found"), { status: 404 });
  }

  const dailyRevenue = buildDateSeries(purchases, 14, "createdAt");
  const dailyInvestments = buildDateSeries(investments, 14, "createdAt");
  const totalRevenue = purchases.reduce((sum, purchase) => sum + Number(purchase.amount || 0), 0);
  const totalInvested = investments.reduce((sum, investment) => sum + Number(investment.amount || 0), 0);
  const fundingProgress = Math.min(100, Math.round((Number(business.funded || 0) / Number(business.fundingGoal || 1)) * 100));

  return {
    businessId: business.id,
    businessName: business.name,
    category: business.category,
    location: business.location,
    fundingGoal: Number(business.fundingGoal || 0),
    funded: Number(business.funded || 0),
    fundingProgress,
    totalRevenue,
    totalInvested,
    dailyRevenue,
    dailyInvestments
  };
}
