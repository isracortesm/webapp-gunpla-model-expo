'use client';

import React from 'react';
import { AuthContext } from './auth-context';
import { UserEntity } from '@/domain/entities/auth/entity';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export function getStoredToken(): string | null {
  try {
    const stored = localStorage.getItem(AUTH_TOKEN_KEY);
    return stored || null;
  } catch {
    return null;
  }
}

function getStoredUser(): UserEntity | null {
  try {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored) as UserEntity;
  } catch {
    return null;
  }
}

export function storeToken(jwt: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, jwt);
  } catch {
    // ignore storage errors
  }
}

function clearStoredToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

export function storeUser(user: UserEntity): void {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // ignore storage errors
  }
}

function clearStoredUser(): void {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // ignore storage errors
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use a ref to store the initial user value, computed once on mount.
  // This avoids React StrictMode double-invoke issues where useState initializer runs twice.
  const storedUserRef = React.useRef<UserEntity | null>(getStoredUser());
  
  const [user, setUser] = React.useState<UserEntity | null>(storedUserRef.current);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const login = React.useCallback((jwt?: string) => {
    if (jwt) storeToken(jwt);
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    clearStoredToken();
    clearStoredUser();
  }, []);

  const fetchCurrentUser = React.useCallback((currentUser: UserEntity) => {
    console.log('AuthContext: store current user...');
      setUser(currentUser);
      storeUser(currentUser);
      setIsAuthReady(true);
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user && isAuthReady,
      isAuthReady,
      login,
      logout,
      fetchCurrentUser
    }),
    [user, isAuthReady, login, logout, fetchCurrentUser],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthWithStorage() {
  const { user, login, logout, fetchCurrentUser } = React.useContext(AuthContext);

  return { user, login, logout, fetchCurrentUser };
}