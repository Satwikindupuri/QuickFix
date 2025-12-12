// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  limit,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isProvider: boolean;
  signup: (email: string, password: string, extra?: { phone?: string }) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProvider, setIsProvider] = useState<boolean>(false);

  useEffect(() => {
    let providerUnsubscribe: (() => void) | null = null;

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);

      // cleanup previous listener
      if (providerUnsubscribe) {
        providerUnsubscribe();
        providerUnsubscribe = null;
      }

      if (u) {
        // Ensure user profile exists (optional)
        try {
          const userRef = doc(db, "users", u.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(
              userRef,
              {
                email: u.email ?? null,
                createdAt: serverTimestamp(),
                displayName: u.displayName ?? null,
              },
              { merge: true }
            );
          }
        } catch (e) {
          console.error("Failed to ensure user profile:", e);
        }

        // Realtime listener: does this user have any provider doc?
        try {
          const providersRef = collection(db, "providers");
          const q = query(providersRef, where("uid", "==", u.uid), limit(1));

          // onSnapshot returns an unsubscribe function
          providerUnsubscribe = onSnapshot(q, (snapshot) => {
            setIsProvider(!snapshot.empty);
          }, (err) => {
            console.error("provider listener error:", err);
            // fallback: set false
            setIsProvider(false);
          });
        } catch (e) {
          console.error("Failed to subscribe provider listener:", e);
          setIsProvider(false);
        }
      } else {
        // user logged out
        setIsProvider(false);
      }
    });

    return () => {
      unsub();
      if (providerUnsubscribe) providerUnsubscribe();
    };
  }, []);

  const signup = (email: string, password: string, extra?: { phone?: string }) =>
    createUserWithEmailAndPassword(auth, email, password).then(async (cred) => {
      // create user doc in Firestore on signup (merge to not overwrite)
      try {
        await setDoc(
          doc(db, "users", cred.user.uid),
          {
            email: cred.user.email ?? null,
            phone: extra?.phone ?? null,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (e) {
        console.error("Failed to create user doc:", e);
      }
      return cred;
    });

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, isProvider, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === null) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
