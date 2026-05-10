import { listCollection } from "./firestore.service.js";

export async function getDashboardData() {
  const [businesses, investments, purchases, ratingsData, viewsData] = await Promise.all([
    listCollection("businesses"),
    listCollection("investments"),
    listCollection("purchases"),
    listCollection("ratingsData"),
    listCollection("viewsData")
  ]);

  return {
    counts: {
      businesses: businesses.length,
      investments: investments.length,
      purchases: purchases.length
    },
    ratingsData,
    viewsData
  };
}
