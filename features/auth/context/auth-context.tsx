'use client';

import React from 'react';
import { UserEntity } from '@/domain/entities/auth/entity';

interface AuthContextValue {
  user: UserEntity | null;
  isAuthenticated: boolean;
  login: (user: UserEntity) => void;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  fetchCurrentUser: async () => {},
});

export function useAuth() {
  return React.useContext(AuthContext);
}