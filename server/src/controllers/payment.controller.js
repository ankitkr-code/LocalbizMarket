import { createIntent } from "../services/payment.service.js";

export async function createPaymentIntent(req, res, next) {
  try {
    res.status(201).json({ payment: createIntent(req.body) });
  } catch (error) {
    next(error);
  }
}
