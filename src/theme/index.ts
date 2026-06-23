import { createTheme, type PaletteMode } from '@mui/material/styles';

export const getTheme = (mode: PaletteMode) => {
  const isDark = mode === 'dark';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#38bdf8', // Vibrant Sky Blue
        light: '#7dd3fc',
        dark: '#0284c7',
        contrastText: isDark ? '#0f172a' : '#ffffff',
      },
      secondary: {
        main: '#a855f7', // Vibrant Purple
        light: '#c084fc',
        dark: '#7e22ce',
      },
      background: {
        default: isDark ? '#020617' : '#f8fafc',
        paper: isDark ? '#0f172a' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f8fafc' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#64748b',
      },
      error: { main: '#ef4444' }, 
      warning: { main: '#f59e0b' }, 
      success: { main: '#10b981' }, 
      info: { main: '#3b82f6' },
      divider: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    },
    typography: {
      fontFamily: '"Outfit", "Inter", "Helvetica", sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.02em' },
      h2: { fontWeight: 800, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.01em' },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { color: isDark ? '#94a3b8' : '#64748b' },
      subtitle2: { color: isDark ? '#94a3b8' : '#64748b', fontWeight: 500 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          body {
            background-color: ${isDark ? '#020617' : '#f8fafc'};
            background-image: ${isDark ? 'radial-gradient(circle at top right, rgba(56,189,248,0.05) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(168,85,247,0.05) 0%, transparent 40%)' : 'radial-gradient(circle at top right, rgba(56,189,248,0.05) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(168,85,247,0.05) 0%, transparent 40%)'};
            background-attachment: fixed;
            scrollbar-gutter: stable;
          }
        `,
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.2)' : '0 8px 32px rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            transition: 'transform 0.3s ease, border-color 0.3s ease',
            '&:hover': {
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)'
            }
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#020617' : '#ffffff',
            borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(2, 6, 23, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 24px',
            transition: 'all 0.3s ease',
          },
        },
        variants: [
          {
            props: { variant: 'contained', color: 'primary' },
            style: {
              background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)',
                boxShadow: '0 6px 20px rgba(56, 189, 248, 0.6)',
              }
            }
          }
        ]
      },
    },
  });
};
