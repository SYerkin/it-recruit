import { apiClient } from './client';

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'ADMIN' | 'HR' | 'CANDIDATE';
  telegramUsername?: string | null;
}

export interface LoginRequest {
  identifier: string; // email or phone
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: number;
      email: string;
      role: string;
      createdAt: string;
      profile?: any;
    };
    token: string;
  };
  message?: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
  telegramUsername?: string | null;
  createdAt: string;
  profile?: any;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      // Обрабатываем ошибки валидации
      if (error.response?.data?.details) {
        const details = error.response.data.details;
        const firstError = Array.isArray(details) ? details[0] : details;
        throw new Error(firstError?.message || 'Ошибка валидации');
      }
      throw error;
    }
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch (error: any) {
      // Обрабатываем ошибки валидации
      if (error.response?.data?.details) {
        const details = error.response.data.details;
        const firstError = Array.isArray(details) ? details[0] : details;
        throw new Error(firstError?.message || 'Ошибка валидации');
      }
      throw error;
    }
  },

  getMe: async (): Promise<{ success: boolean; data: User }> => {
    const response = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
    return response.data;
  },

  updateMe: async (data: { telegramUsername?: string | null }): Promise<{ success: boolean; data: User }> => {
    const response = await apiClient.patch<{ success: boolean; data: User }>('/auth/me', data);
    return response.data;
  },

  changePassword: async (newPassword: string): Promise<{ success: boolean; data: null; message?: string }> => {
    const response = await apiClient.post<{ success: boolean; data: null; message?: string }>('/auth/change-password', { newPassword });
    return response.data;
  },

  forgotPassword: async (email: string, newPassword: string): Promise<{ success: boolean; data: null; message?: string }> => {
    const response = await apiClient.post<{ success: boolean; data: null; message?: string }>('/auth/forgot-password', { email, newPassword });
    return response.data;
  },
};

