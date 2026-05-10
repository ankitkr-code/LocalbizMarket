import { getInvestments, invest } from "../services/investment.service.js";

export async function listInvestments(req, res, next) {
  try {
    res.json({ investments: await getInvestments(req.auth.uid, req.auth.role) });
  } catch (error) {
    next(error);
  }
}

export async function createInvestment(req, res, next) {
  try {
    res.status(201).json({ investment: await invest(req.body, req.auth.uid) });
  } catch (error) {
    next(error);
  }
}
