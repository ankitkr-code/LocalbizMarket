import { getDocument, setDocument } from "./firestore.service.js";
import { validateAmount, createTransaction } from "./wallet.validation.js";

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
  const value = validateAmount(amount, "Amount");
  const transaction = createTransaction("credit", value, "Wallet deposit");

  return setDocument("wallets", userId, {
    balance: Number(wallet.balance || 0) + value,
    transactions: [...(wallet.transactions || []), transaction]
  });
}

export async function debitWallet(userId, amount, label) {
  const wallet = await findWallet(userId);
  const value = validateAmount(amount, "Amount");

  const balance = Number(wallet.balance || 0);
  if (balance < value) {
    throw Object.assign(new Error("Insufficient wallet balance"), { status: 400 });
  }

  const transaction = createTransaction("debit", value, label);

  return setDocument("wallets", userId, {
    balance: balance - value,
    transactions: [...(wallet.transactions || []), transaction]
  });
}
