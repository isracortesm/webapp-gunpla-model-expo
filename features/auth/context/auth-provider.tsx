'use client';

import React from 'react';
import { AuthContext } from './auth-context';
import { UserEntity } from '@/domain/entities/auth/entity';

const AUTH_TOKEN_KEY = 'auth_token';

function getStoredUser(): UserEntity | null {
  try {
    const stored = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return parsed.user || null;
  } catch {
    return null;
  }
}

function storeUser(user: UserEntity): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify({ user }));
  } catch {
    // ignore storage errors
  }
}

function clearStoredUser(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

import { AuthService } from '@/features/auth/service/auth-service';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserEntity | null>(getStoredUser);
  const authServiceRef = React.useRef<AuthService | null>(null);

  // Initialize auth service on mount (client only)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      authServiceRef.current = new AuthService();
    } catch {
      // ignore initialization errors
    }
  }, []);

  const login = React.useCallback((newUser: UserEntity) => {
    setUser(newUser);
    storeUser(newUser);
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    clearStoredUser();
  }, []);

  const fetchCurrentUser = React.useCallback(async () => {
    if (!authServiceRef.current) return;
    
    try {
      const currentUser = await authServiceRef.current.getCurrentUser();
      setUser(currentUser);
      // Update stored user with fresh data (including profileImage, socialNetworks)
      storeUser(currentUser);
    } catch {
      // ignore errors - don't clear user state on fetch failure
    }
  }, []);

  const value = React.useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout, fetchCurrentUser }),
    [user, login, logout, fetchCurrentUser],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthWithStorage() {
  const { user, login, logout } = React.useContext(AuthContext);

  return { user, login, logout };
}