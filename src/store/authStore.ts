import { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const TOKEN_KEY = 'clarion_token';
const USER_KEY = 'clarion_user';

let currentAuthState: AuthState = {
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  token: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY)
};

const listeners = new Set<(state: AuthState) => void>();

function notify() {
  listeners.forEach((listener) => listener({ ...currentAuthState }));
}

export const authStore = {
  getState: () => currentAuthState,
  login: (user: User, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    currentAuthState = { user, token, isAuthenticated: true };
    notify();
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    currentAuthState = { user: null, token: null, isAuthenticated: false };
    notify();
  },
  subscribe: (listener: (state: AuthState) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

export function useAuth() {
  const [state, setState] = useState<AuthState>(authStore.getState());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setState);
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    ...state,
    login: authStore.login,
    logout: authStore.logout
  };
}

export const useAuthStore = useAuth;
