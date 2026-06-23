import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';
import { useMemo } from 'react';
import { useThemeStore } from './store/useThemeStore';
import AppRouter from './routes/AppRouter';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error.response?.status === 401 || error.response?.status === 403) return false;
        return failureCount < 3;
      },
    },
  },
});

function App() {
  const mode = useThemeStore((state) => state.mode);
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-right" />
        <AppRouter />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
