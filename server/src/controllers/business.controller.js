import { addBusiness, getBusinessesForRole, setBusinessReview } from "../services/business.service.js";

export async function listBusinesses(req, res, next) {
  try {
    res.json({ businesses: await getBusinessesForRole({ role: req.auth.role, userId: req.auth.uid }) });
  } catch (error) {
    next(error);
  }
}

export async function createBusiness(req, res, next) {
  try {
    res.status(201).json({ business: await addBusiness(req.body, req.auth.uid) });
  } catch (error) {
    next(error);
  }
}

export async function reviewBusiness(req, res, next) {
  try {
    res.json({ business: await setBusinessReview(req.params.id, req.body.status) });
  } catch (error) {
    next(error);
  }
}
