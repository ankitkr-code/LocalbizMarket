import { createPurchase, getPendingPurchases, getPurchases, reviewPurchase } from "../services/purchase.service.js";

export async function listPurchases(req, res, next) {
  try {
    const purchases = await getPurchases(req.auth.role, req.auth.uid);
    res.json({ purchases });
  } catch (error) {
    next(error);
  }
}

export async function uploadPurchase(req, res, next) {
  try {
    const purchase = await createPurchase(req.body, req.auth.uid);
    res.status(201).json({ purchase });
  } catch (error) {
    next(error);
  }
}

export async function listPendingPurchases(req, res, next) {
  try {
    const purchases = await getPendingPurchases();
    res.json({ purchases });
  } catch (error) {
    next(error);
  }
}

export async function reviewPurchaseRequest(req, res, next) {
  try {
    const { status, reason } = req.body;
    const purchase = await reviewPurchase(req.params.id, status, reason, req.auth.uid);
    res.json({ purchase });
  } catch (error) {
    next(error);
  }
}
