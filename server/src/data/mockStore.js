export const store = {
  users: [
    { id: "u1", name: "Demo Investor", email: "investor@localbiz.test", role: "investor" },
    { id: "u2", name: "Demo Owner", email: "owner@localbiz.test", role: "business_owner" },
    { id: "u3", name: "Demo Admin", email: "admin@localbiz.test", role: "admin" }
  ],
  wallets: [{ id: "w1", userId: "u1", balance: 38000, transactions: [] }],
  businesses: [
    {
      id: "b1",
      ownerId: "u2",
      name: "Green Spoon Cafe",
      category: "Food",
      location: "Indore",
      fundingGoal: 500000,
      funded: 325000,
      status: "approved"
    }
  ],
  investments: [],
  purchases: [],
  ratingsData: [{ businessId: "b1", rating: 4.7, count: 88 }],
  viewsData: [{ businessId: "b1", month: "2026-04", views: 1840 }]
};

export function nextId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}
