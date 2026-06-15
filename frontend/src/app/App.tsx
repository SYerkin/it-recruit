import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalStyle } from './styles/GlobalStyles';
import { Layout } from '@widgets/Layout';
import { useAuthStore } from './store/auth.store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppContent = () => {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Проверяем авторизацию при загрузке приложения
    checkAuth();
  }, [checkAuth]);

  // Периодически проверяем авторизацию каждые 5 минут, если пользователь авторизован
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000); // 5 минут

    return () => clearInterval(interval);
  }, [isAuthenticated, checkAuth]);

  // Проверяем авторизацию при возврате фокуса на вкладку
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        checkAuth();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, checkAuth]);

  return <Layout />;
};

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <AppContent />
    </QueryClientProvider>
  );
};

