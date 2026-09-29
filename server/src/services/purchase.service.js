import { createDocument, getDocument, listCollection, queryCollection, updateDocument } from "./firestore.service.js";

function validateAmount(amount) {
  const value = Number(amount || 0);
  if (!Number.isFinite(value) || value <= 0) {
    throw Object.assign(new Error("Purchase amount must be greater than zero"), { status: 400 });
  }
  return value;
}

function validateReceiptNumber(receiptNumber) {
  const receipt = String(receiptNumber || "").trim();
  if (!receipt || receipt.length < 2) {
    throw Object.assign(new Error("Receipt number must be at least 2 characters"), { status: 400 });
  }
  return receipt;
}

function validateBusinessId(businessId) {
  const id = String(businessId || "").trim();
  if (!id) {
    throw Object.assign(new Error("Business ID is required"), { status: 400 });
  }
  return id;
}

async function requireBusiness(businessId) {
  const business = await getDocument("businesses", businessId);
  if (!business) {
    throw Object.assign(new Error("Business not found"), { status: 404 });
  }
  return business;
}

export function getPurchases(role, userId) {
  return listCollection("purchases").then(purchases => {
    if (role === "admin") return purchases;
    return purchases.filter(p => p.userId === userId);
  });
}

export async function createPurchase(payload, userId) {
  const businessId = validateBusinessId(payload.businessId);
  const amount = validateAmount(payload.amount);
  const receiptNumber = validateReceiptNumber(payload.receiptNumber);
  
  const business = await requireBusiness(businessId);
  
  // Check for duplicate receipt
  const existing = await queryCollection("purchases", [
    ["businessId", "==", businessId],
    ["receiptNumber", "==", receiptNumber]
  ]);
  
  if (existing.length > 0) {
    throw Object.assign(new Error("This receipt number was already uploaded for this business"), { status: 409 });
  }

  return createDocument("purchases", {
    businessId,
    businessName: business.name,
    userId,
    amount,
    receiptNumber,
    notes: payload.notes || "",
    status: "pending",
    uploadedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    reviewReason: ""
  }, "purchase");
}

export async function reviewPurchase(purchaseId, status, reason, adminId) {
  const allowedStatuses = new Set(["verified", "rejected"]);
  
  if (!allowedStatuses.has(status)) {
    throw Object.assign(new Error("Invalid review status"), { status: 400 });
  }

  const purchase = await getDocument("purchases", purchaseId);
  if (!purchase) {
    throw Object.assign(new Error("Purchase not found"), { status: 404 });
  }

  if (purchase.status !== "pending") {
    throw Object.assign(new Error("Only pending purchases can be reviewed"), { status: 400 });
  }

  const now = new Date().toISOString();
  
  return updateDocument("purchases", purchaseId, {
    status,
    reviewedAt: now,
    reviewedBy: adminId,
    reviewReason: reason || ""
  });
}

export async function getPendingPurchases() {
  const purchases = await listCollection("purchases");
  return purchases
    .filter(p => p.status === "pending")
    .sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0));
}
