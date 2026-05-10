import { creditWallet, findWallet } from "../services/wallet.service.js";

export async function getWallet(req, res, next) {
  try {
    const userId = req.auth.role === "admin" ? req.params.userId : req.auth.uid;
    res.json({ wallet: await findWallet(userId) });
  } catch (error) {
    next(error);
  }
}

export async function addFunds(req, res, next) {
  try {
    const userId = req.auth.role === "admin" ? req.params.userId : req.auth.uid;
    res.json({ wallet: await creditWallet(userId, req.body.amount) });
  } catch (error) {
    next(error);
  }
}
