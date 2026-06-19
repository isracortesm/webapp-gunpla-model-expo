'use client';

import React from 'react';
import { AuthContext } from './auth-context';
import { UserEntity } from '@/domain/entities/auth/entity';

const AUTH_TOKEN_KEY = 'auth_token';

export function getStoredToken(): string | null {
  try {
    const stored = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return parsed.jwt || null;
  } catch {
    return null;
  }
}

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

function storeUser(user: UserEntity, jwt?: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify({ user, jwt }));
  } catch {
    // ignore storage errors
  }
}

export function clearStoredToken(): void {
  try {
    const stored = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!stored) return;
    
    const parsed = JSON.parse(stored);
    delete parsed.jwt;
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(parsed));
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
  // Use a ref to store the initial user value, computed once on mount.
  // This avoids React StrictMode double-invoke issues where useState initializer runs twice.
  const storedUserRef = React.useRef<UserEntity | null>(getStoredUser());
  
  const [user, setUser] = React.useState<UserEntity | null>(storedUserRef.current);
  const [isAuthReady, setIsAuthReady] = React.useState(false);
  const authServiceRef = React.useRef<AuthService | null>(null);

  // Initialize auth service and mark as ready on mount (client only)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      authServiceRef.current = new AuthService();
    } catch {
      // ignore initialization errors
    }
    
    setIsAuthReady(true);
  }, []);

  const login = React.useCallback((newUser: UserEntity, jwt?: string) => {
    setUser(newUser);
    storeUser(newUser, jwt);
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    clearStoredToken();
    clearStoredUser();
  }, []);

  const fetchCurrentUser = React.useCallback(async () => {
    if (!authServiceRef.current) return;
    
    try {
      console.log('AuthContext: fetching current user...');
      const currentUser = await authServiceRef.current.getCurrentUser();
      setUser(currentUser);
      // Update stored user with fresh data (including profileImage, socialNetworks)
      storeUser(currentUser);
    } catch {
      // ignore errors - don't clear user state on fetch failure
    }
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
  const { user, login, logout } = React.useContext(AuthContext);

  return { user, login, logout };
}