// ============================================================
// JIOS — useAuth hook
// ============================================================

import { useState, useEffect } from 'react';
import { onAuthStateChange } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<{ email: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((u) => {
      setUser(u ? { email: u.email ?? null } : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
