'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { seed } from './data';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const KEY = 'me-admin-store-v1';
const StoreCtx = createContext(null);

function loadInitial() {
  if (typeof window === 'undefined') return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...seed, ...JSON.parse(raw) };
  } catch { /* fall through to seed */ }
  return seed;
}

export function AdminStoreProvider({ children }) {
  const [state, setState] = useState(loadInitial);

  // Sync to localStorage
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full/blocked */ }
  }, [state]);

  // Real-time Firestore snapshot for leads
  useEffect(() => {
    let unsubscribe;
    try {
      const leadsRef = collection(db, 'leads');
      const q = query(leadsRef, orderBy('createdAt', 'desc'));
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreLeads = snapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
          id: doc.data().id || doc.id,
        }));
        setState((s) => ({ ...s, leads: firestoreLeads }));
      }, (error) => {
        console.error('Firestore snapshot listener error:', error);
      });
    } catch (err) {
      console.error('Error setting up Firestore listener:', err);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const api = useMemo(() => ({
    state,
    get: (col) => state[col],
    setCol: (col, value) => setState((s) => ({ ...s, [col]: value })),
    update: (col, id, patch) => {
      setState((s) => ({
        ...s,
        [col]: s[col].map((it) => (it.id === id ? { ...it, ...patch } : it)),
      }));

      // Persist update to Firestore if collection is leads
      if (col === 'leads') {
        fetch(`/api/leads/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        }).catch((err) => console.error('Failed to patch lead in Firestore:', err));
      }
    },
    add: (col, item) => {
      const id = item.id || `${col}-${Date.now().toString(36)}`;
      const newItem = { ...item, id };
      setState((s) => ({ ...s, [col]: [newItem, ...s[col]] }));

      // Persist new lead to Firestore if collection is leads
      if (col === 'leads') {
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        }).catch((err) => console.error('Failed to save new lead to Firestore:', err));
      }

      return id;
    },
    remove: (col, id) => {
      setState((s) => ({ ...s, [col]: s[col].filter((it) => it.id !== id) }));

      if (col === 'leads') {
        fetch(`/api/leads/${id}`, { method: 'DELETE' })
          .catch((err) => console.error('Failed to delete lead from Firestore:', err));
      }
    },
    reset: () => setState(seed),
  }), [state]);

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used inside AdminStoreProvider');
  return ctx;
}
