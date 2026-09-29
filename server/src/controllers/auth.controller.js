import { /*findUserByEmail,*/ getUserProfile, /*registerUser,*/ upsertUserProfile } from "../services/auth.service.js";

/*export async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await findUserByEmail(req.body.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user, token: "mock-token" });
  } catch (error) {
    next(error);
  }
} */

export async function getMe(req, res, next) {
  try {
    const user = await getUserProfile(req.auth.uid, {
      email: req.auth.email,
      name: req.auth.profile?.name
    });
    res.json({ user });
  } catch (error) {
    next(error);
  }
}

export async function saveProfile(req, res, next) {
  try {
    const user = await upsertUserProfile(req.auth.uid, {
      ...req.body,
      email: req.auth.email || req.body.email
    });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}
