import { createPurchase, getPurchases } from "../services/purchase.service.js";

export async function listPurchases(_req, res, next) {
  try {
    res.json({ purchases: await getPurchases() });
  } catch (error) {
    next(error);
  }
}

export async function uploadPurchase(req, res, next) {
  try {
    res.status(201).json({ purchase: await createPurchase(req.body) });
  } catch (error) {
    next(error);
  }
}
