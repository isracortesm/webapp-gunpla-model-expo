'use client';

import React from 'react';
import { UserEntity } from '@/domain/entities/auth/entity';

interface AuthContextValue {
  user: UserEntity | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (user: UserEntity, jwt?: string) => void;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isAuthReady: false,
  login: () => {},
  logout: () => {},
  fetchCurrentUser: async () => {},
});

export function useAuth() {
  return React.useContext(AuthContext);
}