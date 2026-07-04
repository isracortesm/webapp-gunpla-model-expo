'use client';

import React from 'react';
import { UserEntity } from '@/domain/entities/auth/entity';

interface AuthContextValue {
  user: UserEntity | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (jwt?: string) => void;
  logout: () => void;
  fetchCurrentUser: (user: UserEntity) => void;
  refreshCurrentUser: () => Promise<UserEntity | null>;
}

export const AuthContext = React.createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isAuthReady: false,
  login: () => {},
  logout: () => {},
  fetchCurrentUser: async () => {},
  refreshCurrentUser: async () => null,
});

export function useAuth() {
  return React.useContext(AuthContext);
}