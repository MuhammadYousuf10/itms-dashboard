import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
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
      default: '#F8F9FA', // Very soft grey background
      paper: '#FFFFFF', // Clean white cards
    },
    text: {
      primary: '#1E293B', // Dark slate for main text
      secondary: '#64748B', // Grey for subtitles
    },
    error: { main: '#EF4444' }, 
    warning: { main: '#F59E0B' }, 
    success: { main: '#10B981' }, 
    info: { main: '#3B82F6' },
    divider: '#E2E8F0', // Light borders
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, color: '#0F172A' },
    h2: { fontWeight: 700, color: '#0F172A' },
    h3: { fontWeight: 700, color: '#0F172A' },
    h4: { fontWeight: 600, color: '#0F172A' },
    h5: { fontWeight: 600, color: '#0F172A' },
    h6: { fontWeight: 600, color: '#0F172A' },
    subtitle1: { color: '#64748B' },
    subtitle2: { color: '#64748B', fontWeight: 500 },
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
          background-color: #F8F9FA;
        }
      `,
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)', // Extremely soft shadow
          border: '1px solid #F1F5F9', // Subtle border
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.04)',
          border: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          boxShadow: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1E293B',
          borderBottom: '1px solid #E2E8F0',
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

export default theme;
