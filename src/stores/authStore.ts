import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole, User } from '@/types';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  serverUrl: string;
  refundPassword: string;

  login: (username: string, password: string, serverUrl: string) => boolean;
  logout: () => void;
  setServerUrl: (url: string) => void;
  setRefundPassword: (password: string) => void;
  verifyRefundPassword: (password: string) => boolean;
}

const MOCK_USERS: Record<string, { password: string; role: UserRole; displayName: string }> = {
  super: { password: '123456', role: 'system_admin', displayName: '超级管理员' },
  admin: { password: '123456', role: 'admin', displayName: '店长' },
  zhangsan: { password: '123456', role: 'operator', displayName: '张三' },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      serverUrl: 'https://api.pos.example.com',
      refundPassword: '000000',

      login: (username, password, serverUrl) => {
        const mockUser = MOCK_USERS[username];
        if (mockUser && mockUser.password === password) {
          set({
            isLoggedIn: true,
            user: {
              username,
              role: mockUser.role,
              displayName: mockUser.displayName,
            },
            serverUrl: serverUrl || get().serverUrl,
          });
          return true;
        }
        return false;
      },

      logout: () => set({ isLoggedIn: false, user: null }),

      setServerUrl: (url) => set({ serverUrl: url }),

      setRefundPassword: (password) => set({ refundPassword: password }),

      verifyRefundPassword: (password) => get().refundPassword === password,
    }),
    {
      name: 'pos-auth',
    }
  )
);
