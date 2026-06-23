import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Badge,
  InputBase,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  DirectionsCar as CarIcon,
  Gavel as GavelIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Live Feed', icon: <CarIcon />, path: '/live' },
  { text: 'Challans', icon: <GavelIcon />, path: '/challans' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export default function MainLayout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        {/* Logo Placeholder like Aurora */}
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1,
            background: 'linear-gradient(135deg, #00D4B2 0%, #3B82F6 100%)',
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '1.25rem' }}>
          aurora
        </Typography>
      </Box>
      <Typography sx={{ px: 3, mb: 1, fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
        Homepage
      </Typography>
      <List sx={{ px: 1 }}>
        {menuItems.map((item, index) => {
          const isSelected = index === 0;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  '&.Mui-selected': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isSelected ? 'primary.main' : '#64748B' }}>
                  {React.cloneElement(item.icon as React.ReactElement, { sx: { fontSize: 20 } })}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={{ fontWeight: isSelected ? 600 : 500, fontSize: '0.875rem' }}>
                      {item.text}
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '70px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' }, color: '#64748B' }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Search Bar matching Aurora */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              bgcolor: '#F1F5F9', 
              borderRadius: 8,
              px: 2,
              py: 0.5,
              width: { xs: '100%', sm: 300 }
            }}>
              <SearchIcon sx={{ color: '#94A3B8', mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Search"
                sx={{ ml: 1, flex: 1, fontSize: '0.875rem', color: '#1E293B' }}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton sx={{ color: '#64748B' }}>
              <LanguageIcon fontSize="small" />
            </IconButton>
            <IconButton sx={{ color: '#64748B' }}>
              <Badge badgeContent="" variant="dot" color="error">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
            <Avatar 
              src="https://i.pravatar.cc/150?img=11"
              sx={{ width: 32, height: 32, ml: 1, cursor: 'pointer' }}
            />
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: '70px' }}
      >
        {children}
      </Box>
    </Box>
  );
}
