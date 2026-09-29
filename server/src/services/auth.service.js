import { /*createDocument,*/ getDocument, listCollection, setDocument } from "./firestore.service.js";

const validRoles = new Set(["investor", "business_owner", "admin"]);

export function normalizeRole(role) {
  const normalized = String(role || "investor").trim().toLowerCase().replace(/[\s-]+/g, "_");
  return validRoles.has(normalized) ? normalized : "investor";
}

/*export async function registerUser(payload) {
  const role = normalizeRole(payload.role);
  return createDocument("users", {
    name: payload.name,
    email: payload.email,
    role
  }, "user");
} */

export async function upsertUserProfile(uid, payload) {
  const existing = await getDocument("users", uid);
  const existingRole = normalizeRole(existing?.role);
  const requestedRole = normalizeRole(payload.role);
  const role = existingRole === "admin" ? "admin" : requestedRole !== "admin" ? requestedRole : existingRole;

  return setDocument("users", uid, {
    name: payload.name || existing?.name || payload.email,
    email: payload.email || existing?.email,
    role
  });
}

export async function getUserProfile(uid, fallback = {}) {
  const existing = await getDocument("users", uid);
  if (existing) return existing;

  return setDocument("users", uid, {
    name: fallback.name || fallback.email || "New user",
    email: fallback.email,
    role: "investor"
  });
}

export async function findUserByEmail(email) {
  const users = await listCollection("users");
  return users.find((user) => user.email === email) || null;
}
