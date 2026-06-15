import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обрабатываем ошибки
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или невалиден - только если не на странице логина
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && !currentPath.includes('/auth')) {
        localStorage.removeItem('token');
        // Очищаем zustand store
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          try {
            const parsed = JSON.parse(authStorage);
            parsed.state = {
              user: null,
              token: null,
              isAuthenticated: false,
            };
            localStorage.setItem('auth-storage', JSON.stringify(parsed));
          } catch (e) {
            localStorage.removeItem('auth-storage');
          }
        }
        // Используем replace вместо href, чтобы не было истории в браузере
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

