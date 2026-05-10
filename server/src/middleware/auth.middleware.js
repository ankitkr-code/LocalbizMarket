import { getFirebaseAdmin } from "../config/firebase.js";
import { getUserProfile, normalizeRole } from "../services/auth.service.js";

export async function requireFirebaseAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing Firebase ID token" });
    }

    const firebaseAdmin = getFirebaseAdmin();
    if (!firebaseAdmin) {
      return res.status(503).json({ message: "Firebase Admin is not configured on the server." });
    }

    const decoded = await firebaseAdmin.auth().verifyIdToken(token);
    const profile = await getUserProfile(decoded.uid, {
      email: decoded.email,
      name: decoded.name
    });

    req.auth = {
      uid: decoded.uid,
      email: decoded.email,
      role: normalizeRole(profile.role),
      profile
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired Firebase session" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ message: "You do not have access to this area" });
    }

    next();
  };
}
