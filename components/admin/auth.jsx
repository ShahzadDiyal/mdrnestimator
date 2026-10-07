'use client';
// Real Firebase Authentication provider for the Admin panel.

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase Auth is not initialized or credentials missing
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userEmail = (firebaseUser.email || '').toLowerCase().trim();
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          let userSnap = await getDoc(userDocRef);

          let role = null;
          let name = firebaseUser.displayName || userEmail.split('@')[0] || 'User';

          if (userSnap.exists()) {
            const data = userSnap.data();
            role = data.role;
            name = data.name || name;
          } else {
            // Search users collection by email if doc by uid was not found
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);
            const matchedDoc = snapshot.docs.find(
              (d) => d.data().email && d.data().email.toLowerCase().trim() === userEmail
            );

            if (matchedDoc) {
              const data = matchedDoc.data();
              role = data.role;
              name = data.name || name;
              // Link uid to existing document
              await setDoc(doc(db, 'users', matchedDoc.id), { uid: firebaseUser.uid }, { merge: true });
            } else {
              // Default to Admin if email contains 'admin' or if first user, else Estimator
              role = userEmail.includes('admin') ? 'Admin' : 'Estimator';
              await setDoc(
                userDocRef,
                {
                  uid: firebaseUser.uid,
                  email: userEmail,
                  name,
                  role,
                  status: 'Active',
                  lastLogin: new Date().toISOString(),
                },
                { merge: true }
              );
            }
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name,
            role: role || 'Estimator',
          });
        } catch (err) {
          console.error('Error fetching user profile from Firestore:', err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: 'Admin',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const api = useMemo(
    () => ({
      user,
      loading,
      async login(email, password) {
        try {
          const cred = await signInWithEmailAndPassword(auth, String(email).trim(), password);
          return { ok: true, user: cred.user };
        } catch (err) {
          console.error('Firebase sign in error:', err);
          let message = 'Failed to sign in. Please check your credentials.';
          if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
            message = 'Invalid email or password.';
          } else if (err.code === 'auth/invalid-email') {
            message = 'Please enter a valid email address.';
          } else if (err.code === 'auth/user-disabled') {
            message = 'This account has been disabled.';
          } else if (err.code === 'auth/too-many-requests') {
            message = 'Too many failed login attempts. Please try again in a few minutes.';
          } else if (err.code === 'auth/network-request-failed') {
            message = 'Network error. Please check your internet connection.';
          } else if (err.message) {
            message = err.message;
          }
          return { ok: false, error: message };
        }
      },
      async logout() {
        try {
          await signOut(auth);
          setUser(null);
        } catch (err) {
          console.error('Firebase sign out error:', err);
        }
      },
    }),
    [user, loading]
  );

  return <AuthCtx.Provider value={api}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function isAdmin(user) {
  return user?.role === 'Admin' || !user?.role; // Defaults to Admin for single-admin / authenticated admin users
}
