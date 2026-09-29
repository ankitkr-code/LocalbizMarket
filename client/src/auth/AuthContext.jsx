import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { auth, firebaseReady } from "../firebase.js";

const AuthContext = createContext(null);

function normalizeRole(role) {
  const normalized = String(role || "guest").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (normalized === "business_owner" || normalized === "investor" || normalized === "admin") {
    return normalized;
  }
  return "guest";
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getToken() {
    if (!auth?.currentUser) return null;
    return auth.currentUser.getIdToken();
  }

  async function loadProfile(user) {
    if (!user) {
      setProfile(null);
      return;
    }

    const tokenGetter = () => user.getIdToken();
    const response = await api("/auth/me", { getToken: tokenGetter });
    setProfile(response.user);
  }

  useEffect(() => {
    if (!firebaseReady || !auth) {
      setIsLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      try {
        await loadProfile(user);
      } catch {
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  async function register({ name, email, password, role }) {
    if (!firebaseReady || !auth) {
      throw new Error("Firebase is not configured yet. Add your client Firebase env values.");
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(credential.user, { displayName: name });
    }

    const response = await api("/auth/profile", {
      method: "POST",
      body: JSON.stringify({ name, email, role }),
      getToken: () => credential.user.getIdToken()
    });
    setProfile(response.user);
    return response.user;
  }

  async function login(email, password) {
    if (!firebaseReady || !auth) {
      throw new Error("Firebase is not configured yet. Add your client Firebase env values.");
    }

    const credential = await signInWithEmailAndPassword(auth, email, password);
    await loadProfile(credential.user);
  }

  async function requestPasswordReset(email) {
    if (!firebaseReady || !auth) {
      throw new Error("Firebase is not configured yet. Add your client Firebase env values.");
    }

    await sendPasswordResetEmail(auth, email);
  }

  async function logout() {
    if (auth) {
      await signOut(auth);
    }
    setProfile(null);
  }

  const value = useMemo(
    () => ({
      firebaseReady,
      firebaseUser,
      getToken,
      isAuthenticated: Boolean(firebaseUser),
      isLoading,
      login,
      logout,
      profile,
      register,
      requestPasswordReset,
      role: normalizeRole(profile?.role)
    }),
    [firebaseUser, isLoading, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
