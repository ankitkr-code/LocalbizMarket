import { getFirestore } from "../config/firebase.js";
import { createDocument, getDocument, listCollection, updateDocument } from "./firestore.service.js";
import { debitWallet } from "./wallet.service.js";

export async function getInvestments(userId, role) {
  const investments = await listCollection("investments");
  if (role === "admin") return investments;
  return investments.filter((investment) => investment.investorId === userId);
}

export async function invest(payload, investorId) {
  const amount = Number(payload.amount || 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw Object.assign(new Error("Investment amount must be greater than zero"), { status: 400 });
  }

  const db = getFirestore();
  if (db) {
    return investWithTransaction(db, payload.businessId, investorId, amount);
  }

  return investWithMockStore(payload.businessId, investorId, amount);
}

async function investWithTransaction(db, businessId, investorId, amount) {
  const now = new Date().toISOString();
  const businessRef = db.collection("businesses").doc(businessId);
  const walletRef = db.collection("wallets").doc(investorId);
  const investmentRef = db.collection("investments").doc();

  return db.runTransaction(async (transaction) => {
    const [businessSnapshot, walletSnapshot] = await Promise.all([
      transaction.get(businessRef),
      transaction.get(walletRef)
    ]);

    if (!businessSnapshot.exists) {
      throw Object.assign(new Error("Business not found"), { status: 404 });
    }

    const business = { id: businessSnapshot.id, ...businessSnapshot.data() };
    if (business.status !== "approved") {
      throw Object.assign(new Error("Only approved businesses can receive investments"), { status: 400 });
    }

    const wallet = walletSnapshot.exists
      ? { id: walletSnapshot.id, ...walletSnapshot.data() }
      : { id: investorId, userId: investorId, balance: 0, transactions: [] };
    const balance = Number(wallet.balance || 0);

    if (balance < amount) {
      throw Object.assign(new Error("Insufficient wallet balance"), { status: 400 });
    }

    const walletTransaction = {
      type: "debit",
      amount,
      label: `Investment in ${business.name}`,
      createdAt: now
    };
    const investment = {
      investorId,
      businessId: business.id,
      businessName: business.name,
      amount,
      status: "active",
      createdAt: now
    };

    transaction.set(walletRef, {
      userId: investorId,
      balance: balance - amount,
      transactions: [...(wallet.transactions || []), walletTransaction],
      updatedAt: now
    }, { merge: true });
    transaction.set(businessRef, {
      funded: Number(business.funded || 0) + amount,
      updatedAt: now
    }, { merge: true });
    transaction.set(investmentRef, investment);

    return { id: investmentRef.id, ...investment };
  });
}

async function investWithMockStore(businessId, investorId, amount) {
  const business = await getDocument("businesses", businessId);
  if (!business) {
    throw Object.assign(new Error("Business not found"), { status: 404 });
  }

  if (business.status !== "approved") {
    throw Object.assign(new Error("Only approved businesses can receive investments"), { status: 400 });
  }

  await debitWallet(investorId, amount, `Investment in ${business.name}`);
  const funded = Number(business.funded || 0) + amount;
  await updateDocument("businesses", business.id, { funded });

  return createDocument("investments", {
    investorId,
    businessId: business.id,
    businessName: business.name,
    amount,
    status: "active"
  }, "investment");
}
