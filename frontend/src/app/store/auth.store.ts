import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi, User } from '@shared/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'ADMIN' | 'HR' | 'CANDIDATE') => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (identifier: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({ identifier, password });
          if (response.success && response.data) {
            localStorage.setItem('token', response.data.token);
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Ошибка входа';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (email: string, password: string, role: 'ADMIN' | 'HR' | 'CANDIDATE') => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register({ email, password, role });
          if (response.success && response.data) {
            localStorage.setItem('token', response.data.token);
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Ошибка регистрации';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        // Проверяем, не истек ли токен (если есть информация о времени истечения)
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = tokenPayload.exp * 1000; // конвертируем в миллисекунды
          const currentTime = Date.now();
          
          // Если токен истек, очищаем его
          if (expirationTime < currentTime) {
            localStorage.removeItem('token');
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return;
          }
        } catch (e) {
          // Если не удалось распарсить токен, продолжаем проверку через API
        }

        set({ isLoading: true });
        try {
          const response = await authApi.getMe();
          if (response.success && response.data) {
            set({
              user: response.data,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          localStorage.removeItem('token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

