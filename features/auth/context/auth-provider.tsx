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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserEntity | null>(getStoredUser);

  const login = React.useCallback((newUser: UserEntity) => {
    setUser(newUser);
    storeUser(newUser);
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    clearStoredUser();
  }, []);

  const value = React.useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user, login, logout],
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