export function validateAmount(amount, label = "Amount") {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    throw Object.assign(new Error(`${label} must be greater than zero`), { status: 400 });
  }
  return value;
}

export function createTransaction(type, amount, label) {
  return {
    type,
    amount,
    label,
    createdAt: new Date().toISOString()
  };
}
