import { createDocument, getDocument, listCollection, queryCollection, updateDocument } from "./firestore.service.js";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function requirePositiveNumber(value, message) {
  const number = Number(value || 0);
  if (!Number.isFinite(number) || number <= 0) {
    throw Object.assign(new Error(message), { status: 400 });
  }
  return number;
}

function getHealthBadge({ hasClaimData, trustScore, suspiciousProofCount, rejectedProofCount, verifiedRevenuePercent, activityMatchPercent }) {
  if (!hasClaimData) return "Needs claim";
  if (suspiciousProofCount > 0 || rejectedProofCount > 1) return "Needs review";
  if (trustScore >= 75 && verifiedRevenuePercent >= 60) return "Strong proof";
  if (trustScore >= 50 || activityMatchPercent >= 50) return "Growing signal";
  return "Weak proof";
}

async function requireBusiness(businessId) {
  const business = await getDocument("businesses", businessId);
  if (!business) {
    throw Object.assign(new Error("Business not found"), { status: 404 });
  }
  return business;
}

export async function createSalesClaim(payload, ownerId, role) {
  const business = await requireBusiness(payload.businessId);
  if (role !== "admin" && business.ownerId !== ownerId) {
    throw Object.assign(new Error("You can only claim sales for your own business"), { status: 403 });
  }
  const dateKey = todayKey();
  const claims = await queryCollection("salesClaims", [
    ["businessId", "==", business.id],
    ["ownerId", "==", business.ownerId],
    ["dateKey", "==", dateKey]
  ]);
  const existingClaim = claims[0];
  if (existingClaim) {
    throw Object.assign(new Error("Sales claim already submitted for this business today"), { status: 409 });
  }

  return createDocument("salesClaims", {
    businessId: business.id,
    businessName: business.name,
    ownerId: business.ownerId,
    claimedSalesAmount: requirePositiveNumber(payload.claimedSalesAmount, "Claimed sales amount must be greater than zero"),
    claimedCustomerCount: requirePositiveNumber(payload.claimedCustomerCount, "Claimed customer count must be greater than zero"),
    notes: payload.notes || "",
    dateKey,
    status: "submitted",
    createdAt: new Date().toISOString()
  }, "claim");
}

export async function createCheckIn(payload, userId) {
  const business = await requireBusiness(payload.businessId);
  const dateKey = todayKey();
  const checkIns = await queryCollection("customerCheckIns", [
    ["businessId", "==", business.id],
    ["userId", "==", userId],
    ["dateKey", "==", dateKey]
  ]);
  const existingCheckIn = checkIns[0];
  if (existingCheckIn) {
    throw Object.assign(new Error("You already checked in to this business today"), { status: 409 });
  }

  return createDocument("customerCheckIns", {
    businessId: business.id,
    businessName: business.name,
    userId,
    dateKey,
    createdAt: new Date().toISOString()
  }, "checkin");
}

export async function createReview(payload, userId) {
  const business = await requireBusiness(payload.businessId);
  const rating = Math.min(5, Math.max(1, Number(payload.rating || 5)));
  return createDocument("reviews", {
    businessId: business.id,
    businessName: business.name,
    userId,
    rating,
    text: payload.text || "",
    createdAt: new Date().toISOString()
  }, "review");
}

export async function createQrConfirmation(payload, userId) {
  const business = await requireBusiness(payload.businessId);
  const receiptNumber = String(payload.receiptNumber || "").trim();
  if (!receiptNumber) {
    throw Object.assign(new Error("Receipt or QR code is required for purchase confirmation"), { status: 400 });
  }

  const confirmations = await queryCollection("qrConfirmations", [
    ["businessId", "==", business.id],
    ["receiptNumber", "==", receiptNumber]
  ]);
  const existingConfirmation = confirmations[0];
  if (existingConfirmation) {
    throw Object.assign(new Error("This receipt or QR code was already confirmed"), { status: 409 });
  }

  return createDocument("qrConfirmations", {
    businessId: business.id,
    businessName: business.name,
    userId,
    amount: requirePositiveNumber(payload.amount, "Confirmed purchase amount must be greater than zero"),
    receiptNumber,
    status: "submitted",
    createdAt: new Date().toISOString()
  }, "qr");
}

export async function listActivityProofs() {
  const [claims, confirmations, auditLogs] = await Promise.all([
    listCollection("salesClaims"),
    listCollection("qrConfirmations"),
    queryCollection("auditLogs", [], { orderBy: ["createdAt", "desc"], limit: 25 })
  ]);

  return {
    claims: claims.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    confirmations: confirmations.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    auditLogs
  };
}

export async function reviewActivityProof({ type, id, status, reason, adminId }) {
  const allowedTypes = new Set(["salesClaims", "qrConfirmations"]);
  const allowedStatuses = new Set(["verified", "rejected", "suspicious"]);

  if (!allowedTypes.has(type)) {
    throw Object.assign(new Error("Unsupported proof type"), { status: 400 });
  }

  if (!allowedStatuses.has(status)) {
    throw Object.assign(new Error("Unsupported proof status"), { status: 400 });
  }

  const proof = await getDocument(type, id);
  if (!proof) {
    throw Object.assign(new Error("Proof not found"), { status: 404 });
  }

  const now = new Date().toISOString();
  const updatedProof = await updateDocument(type, id, {
    status,
    reviewReason: reason || "",
    reviewedBy: adminId,
    reviewedAt: now
  });

  await createDocument("auditLogs", {
    adminId,
    action: `marked_${status}`,
    targetType: type,
    targetId: id,
    businessId: proof.businessId,
    businessName: proof.businessName,
    reason: reason || "",
    createdAt: now
  }, "audit");

  return updatedProof;
}

function calculateRevenueMetrics(claims, confirmations) {
  const verifiedClaims = claims.filter((item) => item.status === "verified");
  const verifiedConfirmations = confirmations.filter((item) => item.status === "verified");
  const submittedConfirmations = confirmations.filter((item) => !["rejected", "suspicious"].includes(item.status));
  const claimedSalesAmount = claims.reduce((sum, item) => sum + Number(item.claimedSalesAmount || 0), 0);
  const confirmedRevenueFromClaims = verifiedClaims.reduce((sum, item) => sum + Number(item.claimedSalesAmount || 0), 0);
  const confirmedRevenueFromConfirmations = verifiedConfirmations.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const confirmedRevenue = confirmedRevenueFromClaims + confirmedRevenueFromConfirmations;
  const submittedConfirmedRevenue = submittedConfirmations.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const verifiedRevenuePercent = claimedSalesAmount > 0 ? Math.round((confirmedRevenue / claimedSalesAmount) * 100) : 0;

  return { verifiedClaims, verifiedConfirmations, submittedConfirmations, claimedSalesAmount, confirmedRevenue, submittedConfirmedRevenue, verifiedRevenuePercent };
}

function calculateActivityMetrics(claims, checkIns, reviews, confirmations) {
  const claimedCustomerCount = claims.reduce((sum, item) => sum + Number(item.claimedCustomerCount || 0), 0);
  const submittedConfirmations = confirmations.filter((item) => !["rejected", "suspicious"].includes(item.status));
  const customerActivityCount = checkIns.length + reviews.length + submittedConfirmations.length;
  const activityMatchPercent = claimedCustomerCount > 0 ? Math.round((customerActivityCount / claimedCustomerCount) * 100) : 0;

  return { claimedCustomerCount, customerActivityCount, activityMatchPercent };
}

function calculateTrustScore(verifiedRevenuePercent, activityMatchPercent, hasClaimData, suspiciousProofCount, rejectedProofCount) {
  const suspiciousPenalty = suspiciousProofCount * 15;
  const rejectedPenalty = rejectedProofCount * 10;
  const baseScore = Math.round((verifiedRevenuePercent * 0.6) + (activityMatchPercent * 0.4));
  const trustScore = hasClaimData ? Math.max(0, Math.min(100, baseScore - suspiciousPenalty - rejectedPenalty)) : null;

  return { trustScore, baseScore, suspiciousPenalty, rejectedPenalty };
}

export async function getActivitySummary(businessId) {
  const [claims, checkIns, reviews, confirmations] = await Promise.all([
    queryCollection("salesClaims", [["businessId", "==", businessId]]),
    queryCollection("customerCheckIns", [["businessId", "==", businessId]]),
    queryCollection("reviews", [["businessId", "==", businessId]]),
    queryCollection("qrConfirmations", [["businessId", "==", businessId]])
  ]);

  const { verifiedConfirmations, submittedConfirmations, claimedSalesAmount, confirmedRevenue, submittedConfirmedRevenue, verifiedRevenuePercent } = calculateRevenueMetrics(claims, confirmations);
  const { claimedCustomerCount, customerActivityCount, activityMatchPercent } = calculateActivityMetrics(claims, checkIns, reviews, confirmations);
  
  const suspiciousProofCount = [...claims, ...confirmations].filter((item) => item.status === "suspicious").length;
  const rejectedProofCount = [...claims, ...confirmations].filter((item) => item.status === "rejected").length;
  const hasClaimData = claimedSalesAmount > 0 && claimedCustomerCount > 0;
  
  const { trustScore, baseScore, suspiciousPenalty, rejectedPenalty } = calculateTrustScore(verifiedRevenuePercent, activityMatchPercent, hasClaimData, suspiciousProofCount, rejectedProofCount);
  const healthBadge = getHealthBadge({ hasClaimData, trustScore: trustScore || 0, suspiciousProofCount, rejectedProofCount, verifiedRevenuePercent, activityMatchPercent });

  return {
    businessId,
    claimedSalesAmount,
    claimedCustomerCount,
    confirmedRevenue,
    submittedConfirmedRevenue,
    checkIns: checkIns.length,
    reviews: reviews.length,
    qrConfirmations: submittedConfirmations.length,
    verifiedQrConfirmations: verifiedConfirmations.length,
    suspiciousProofCount,
    rejectedProofCount,
    customerActivityCount,
    verifiedRevenuePercent,
    activityMatchPercent,
    scoreBreakdown: {
      verifiedRevenuePercent,
      activityMatchPercent,
      suspiciousPenalty,
      rejectedPenalty,
      baseScore: hasClaimData ? baseScore : null
    },
    trustScore,
    trustStatus: hasClaimData ? "ready" : "missing_claim",
    healthBadge
  };
}
