// ============================================================
// JIOS Padel & Coffee — Auth Service
// ============================================================

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock admin credentials (only used in mock/demo mode)
const MOCK_ADMIN_EMAIL = 'admin@jios.com';
const MOCK_ADMIN_PASSWORD = 'jios2024';

let mockUser: { email: string } | null = null;
const authListeners: ((user: { email: string } | null) => void)[] = [];

export async function signIn(email: string, password: string): Promise<void> {
  if (USE_MOCK) {
    if (email === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
      mockUser = { email };
      authListeners.forEach((l) => l(mockUser));
      return;
    }
    throw new Error('Invalid email or password.');
  }

  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOut(): Promise<void> {
  if (USE_MOCK) {
    mockUser = null;
    authListeners.forEach((l) => l(null));
    return;
  }

  await firebaseSignOut(auth);
}

export function onAuthStateChange(callback: (user: User | { email: string } | null) => void): () => void {
  if (USE_MOCK) {
    // Immediately call with current mock user
    callback(mockUser);
    authListeners.push(callback as (user: { email: string } | null) => void);
    return () => {
      const idx = authListeners.indexOf(callback as (user: { email: string } | null) => void);
      if (idx > -1) authListeners.splice(idx, 1);
    };
  }

  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | { email: string } | null {
  if (USE_MOCK) return mockUser;
  return auth.currentUser;
}
