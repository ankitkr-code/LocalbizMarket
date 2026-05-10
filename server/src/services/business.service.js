import { createDocument, listCollection, updateDocument } from "./firestore.service.js";

export function getBusinesses() {
  return listCollection("businesses");
}

export function addBusiness(payload, ownerId) {
  return createDocument("businesses", {
    ownerId,
    name: payload.name,
    category: payload.category,
    location: payload.location,
    fundingGoal: Number(payload.fundingGoal || 0),
    funded: 0,
    status: "pending",
    summary: payload.summary || ""
  }, "business");
}

export function setBusinessReview(id, status) {
  return updateDocument("businesses", id, { status });
}
