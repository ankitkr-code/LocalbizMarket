import { getFirestore } from "../config/firebase.js";
import { nextId, store } from "../data/mockStore.js";

export async function listCollection(collectionName) {
  const db = getFirestore();
  if (!db) return store[collectionName] || [];

  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function createDocument(collectionName, data, prefix = "doc") {
  const db = getFirestore();
  if (!db) {
    const item = { id: nextId(prefix), ...data, createdAt: new Date().toISOString() };
    store[collectionName] = [...(store[collectionName] || []), item];
    return item;
  }

  const ref = await db.collection(collectionName).add({
    ...data,
    createdAt: new Date().toISOString()
  });
  return { id: ref.id, ...data };
}

export async function getDocument(collectionName, id) {
  const db = getFirestore();
  if (!db) {
    return (store[collectionName] || []).find((item) => item.id === id) || null;
  }

  const snapshot = await db.collection(collectionName).doc(id).get();
  if (!snapshot.exists) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function setDocument(collectionName, id, data) {
  const db = getFirestore();
  if (!db) {
    const items = store[collectionName] || [];
    const index = items.findIndex((item) => item.id === id);
    const item = {
      ...(index >= 0 ? items[index] : { id }),
      ...data,
      updatedAt: new Date().toISOString()
    };
    if (index >= 0) {
      items[index] = item;
    } else {
      store[collectionName] = [...items, item];
    }
    return item;
  }

  await db.collection(collectionName).doc(id).set(
    {
      ...data,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );
  return { id, ...data };
}

export async function updateDocument(collectionName, id, data) {
  const db = getFirestore();
  if (!db) {
    const items = store[collectionName] || [];
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
    return items[index];
  }

  await db.collection(collectionName).doc(id).set(data, { merge: true });
  return { id, ...data };
}
