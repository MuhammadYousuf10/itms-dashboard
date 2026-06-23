import { createTheme, type PaletteMode } from '@mui/material/styles';

export const getTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#3B82F6', // Blue for buttons/accents
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00D4B2', // Aurora Cyan
      light: '#33DDC1',
      dark: '#00947C',
    },
    background: {
      default: mode === 'light' ? '#F8F9FA' : '#0B1120',
      paper: mode === 'light' ? '#FFFFFF' : '#1E293B',
    },
    text: {
      primary: mode === 'light' ? '#1E293B' : '#F8FAFC',
      secondary: mode === 'light' ? '#64748B' : '#94A3B8',
    },
    error: { main: '#EF4444' }, 
    warning: { main: '#F59E0B' }, 
    success: { main: '#10B981' }, 
    info: { main: '#3B82F6' },
    divider: mode === 'light' ? '#E2E8F0' : '#334155',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { color: mode === 'light' ? '#64748B' : '#94A3B8' },
    subtitle2: { color: mode === 'light' ? '#64748B' : '#94A3B8', fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        * {
          box-sizing: border-box;
        }
        body {
          background-color: ${mode === 'light' ? '#F8F9FA' : '#0B1120'};
          transition: background-color 0.3s ease;
        }
      `,
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: mode === 'light' ? '0px 4px 20px rgba(0, 0, 0, 0.03)' : '0px 4px 20px rgba(0, 0, 0, 0.4)',
          border: `1px solid ${mode === 'light' ? '#F1F5F9' : '#334155'}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' ? '0px 2px 12px rgba(0, 0, 0, 0.04)' : '0px 4px 20px rgba(0, 0, 0, 0.2)',
          border: 'none',
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E293B',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#0F172A',
          borderRight: `1px solid ${mode === 'light' ? '#E2E8F0' : '#1E293B'}`,
          boxShadow: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#0F172A',
          color: mode === 'light' ? '#1E293B' : '#F8FAFC',
          borderBottom: `1px solid ${mode === 'light' ? '#E2E8F0' : '#1E293B'}`,
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '0 8px',
          padding: '8px 16px',
        }
      }
    }
  },
});
