import { createDocument, listCollection } from "./firestore.service.js";

export function getPurchases() {
  return listCollection("purchases");
}

export function createPurchase(payload) {
  return createDocument("purchases", {
    businessId: payload.businessId,
    userId: payload.userId,
    amount: Number(payload.amount || 0),
    receiptNumber: payload.receiptNumber,
    notes: payload.notes || "",
    status: "pending"
  }, "purchase");
}
