import fs from "node:fs";
import path from "node:path";
import admin from "firebase-admin";

let db = null;

function getServiceAccount() {
  const filePath = path.resolve(process.cwd(), "firebase-service-account.json");
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    };
  }

  return null;
}

export function getFirestore() {
  if (db) return db;

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    return null;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  db = admin.firestore();
  return db;
}

export function getFirebaseAdmin() {
  const database = getFirestore();
  return database ? admin : null;
}
