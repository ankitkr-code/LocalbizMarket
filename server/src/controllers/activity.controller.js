import { createCheckIn, createQrConfirmation, createReview, createSalesClaim, getActivitySummary, listActivityProofs, reviewActivityProof } from "../services/activity.service.js";

export async function submitSalesClaim(req, res, next) {
  try {
    const claim = await createSalesClaim(req.body, req.auth.uid, req.auth.role);
    res.status(201).json({ claim });
  } catch (error) {
    next(error);
  }
}

export async function submitCheckIn(req, res, next) {
  try {
    const checkIn = await createCheckIn(req.body, req.auth.uid);
    res.status(201).json({ checkIn });
  } catch (error) {
    next(error);
  }
}

export async function submitReview(req, res, next) {
  try {
    const review = await createReview(req.body, req.auth.uid);
    res.status(201).json({ review });
  } catch (error) {
    next(error);
  }
}

export async function submitQrConfirmation(req, res, next) {
  try {
    const confirmation = await createQrConfirmation(req.body, req.auth.uid);
    res.status(201).json({ confirmation });
  } catch (error) {
    next(error);
  }
}

export async function getBusinessActivitySummary(req, res, next) {
  try {
    res.json({ summary: await getActivitySummary(req.params.businessId) });
  } catch (error) {
    next(error);
  }
}

export async function getActivityProofs(_req, res, next) {
  try {
    res.json(await listActivityProofs());
  } catch (error) {
    next(error);
  }
}

export async function reviewProof(req, res, next) {
  try {
    const proof = await reviewActivityProof({
      type: req.params.type,
      id: req.params.id,
      status: req.body.status,
      reason: req.body.reason,
      adminId: req.auth.uid
    });
    res.json({ proof });
  } catch (error) {
    next(error);
  }
}
