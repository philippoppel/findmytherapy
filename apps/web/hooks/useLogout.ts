'use client';

import { useState, useCallback } from 'react';
import { signOut } from 'next-auth/react';

export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // Clear any client-side state/cache
      if (typeof window !== 'undefined') {
        // Clear localStorage items related to auth
        localStorage.removeItem('auth-state');
      }

      // Sign out via NextAuth
      await signOut({ redirect: false });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always redirect to homepage, even if signOut fails
      // This prevents the UI from hanging
      window.location.href = '/';
    }
  }, [isLoggingOut]);

  return { logout, isLoggingOut };
}
