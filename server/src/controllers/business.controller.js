import { addBusiness, getBusinesses, setBusinessReview } from "../services/business.service.js";

export async function listBusinesses(req, res, next) {
  try {
    const businesses = await getBusinesses();
    const visibleBusinesses = businesses.filter((business) => {
      if (req.auth.role === "admin") return true;
      if (req.auth.role === "business_owner") return business.ownerId === req.auth.uid;
      return business.status === "approved";
    });

    res.json({ businesses: visibleBusinesses });
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
