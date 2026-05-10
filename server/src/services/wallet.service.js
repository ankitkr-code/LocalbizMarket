import { getDocument, setDocument } from "./firestore.service.js";

export async function findWallet(userId) {
  const wallet = await getDocument("wallets", userId);
  if (wallet) return wallet;

  return setDocument("wallets", userId, {
    userId,
    balance: 0,
    transactions: [],
    createdAt: new Date().toISOString()
  });
}

export async function creditWallet(userId, amount) {
  const wallet = await findWallet(userId);
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    throw Object.assign(new Error("Amount must be greater than zero"), { status: 400 });
  }

  const transaction = {
    type: "credit",
    amount: value,
    label: "Wallet deposit",
    createdAt: new Date().toISOString()
  };

  return setDocument("wallets", userId, {
    balance: Number(wallet.balance || 0) + value,
    transactions: [...(wallet.transactions || []), transaction]
  });
}

export async function debitWallet(userId, amount, label) {
  const wallet = await findWallet(userId);
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    throw Object.assign(new Error("Amount must be greater than zero"), { status: 400 });
  }

  const balance = Number(wallet.balance || 0);
  if (balance < value) {
    throw Object.assign(new Error("Insufficient wallet balance"), { status: 400 });
  }

  const transaction = {
    type: "debit",
    amount: value,
    label,
    createdAt: new Date().toISOString()
  };

  return setDocument("wallets", userId, {
    balance: balance - value,
    transactions: [...(wallet.transactions || []), transaction]
  });
}
