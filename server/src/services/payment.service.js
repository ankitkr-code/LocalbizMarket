export function createIntent(payload) {
  return {
    provider: payload.provider || "mock",
    status: "created",
    amount: Number(payload.amount || 0),
    currency: "INR",
    message: "Payment gateway placeholder. Connect Razorpay or Stripe credentials to enable live payments."
  };
}
