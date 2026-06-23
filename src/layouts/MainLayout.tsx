import { useState, cloneElement } from 'react';
import type { ReactElement } from 'react';
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
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  Map as MapIcon,
  Videocam as VideocamIcon,
  BarChart as AnalyticsIcon,
  LiveTv as LiveTvIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { axiosClient } from '../api/axiosClient';
import { useThemeStore } from '../store/useThemeStore';
import { LightMode as LightModeIcon, DarkMode as DarkModeIcon } from '@mui/icons-material';

const drawerWidth = 260;

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const isOperator = user?.role === 'OPERATOR';

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Live Map', icon: <MapIcon />, path: '/map' },
    { text: 'Live Feed', icon: <LiveTvIcon />, path: '/live' },
    { text: 'Challans', icon: <ReceiptIcon />, path: '/challans' },
    ...(!isOperator ? [
      { text: 'Cameras', icon: <VideocamIcon />, path: '/cameras' },
      { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
      { text: 'Team Access', icon: <PeopleIcon />, path: '/team' },
      { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
    ] : [])
  ];

  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  const { mode, toggleTheme } = useThemeStore();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => setNotifAnchor(event.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  const handleOpenNotifModal = () => {
    setNotifAnchor(null);
    setIsNotifModalOpen(true);
  };
  const handleCloseNotifModal = () => setIsNotifModalOpen(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsVehicleModalOpen(true);
    }
  };

  const handleLogout = async () => {
    handleProfileClose();
    try {
      await axiosClient.post('/auth/logout');
    } catch (e) {
      console.error('Logout API failed', e);
    }
    logout();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const drawer = (
    <div>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            background: 'linear-gradient(135deg, #00D4B2 0%, #3B82F6 100%)',
          }}
        />
        <Typography variant="h6" sx={{ color: 'text.primary', fontSize: '1.25rem' }}>
          aurora
        </Typography>
      </Box>
      <Typography sx={{ px: 3, pt: 3, mb: 1, fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>
        Homepage
      </Typography>
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => navigate(item.path)}
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
                <ListItemIcon sx={{ minWidth: 36, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                  {cloneElement(item.icon as ReactElement, { sx: { fontSize: 20 } } as any)}
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
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '70px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' }, color: 'text.secondary' }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box 
              component="form" 
              onSubmit={handleSearchSubmit}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: 'action.hover', 
                borderRadius: 8,
                px: 2,
                py: 0.5,
                width: { xs: '100%', sm: 300 }
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Search vehicles, challans, cameras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ ml: 1, flex: 1, fontSize: '0.875rem', color: 'text.primary' }}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton sx={{ color: 'text.secondary' }} onClick={toggleTheme}>
              {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
            <IconButton sx={{ color: 'text.secondary' }} onClick={handleNotifOpen}>
              <Badge badgeContent="3" variant="standard" color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}>
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
            <Avatar 
              src="https://i.pravatar.cc/150?img=11"
              sx={{ width: 32, height: 32, ml: 1, cursor: 'pointer' }}
              onClick={handleProfileOpen}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notifAnchor}
        open={Boolean(notifAnchor)}
        onClose={handleNotifClose}
        slotProps={{ paper: { sx: { width: 300, mt: 1, boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', borderRadius: 2 } } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Notifications</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleNotifClose} sx={{ py: 1.5 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Speeding detected</Typography>
            <Typography variant="caption" color="text.secondary">Highway 1 North • 2 mins ago</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotifClose} sx={{ py: 1.5 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Camera CAM-04 Offline</Typography>
            <Typography variant="caption" color="text.secondary">East Toll Plaza • 15 mins ago</Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleOpenNotifModal} sx={{ justifyContent: 'center', color: 'primary.main', fontWeight: 600 }}>
          View All Alerts
        </MenuItem>
      </Menu>

      {/* Vehicle Profile Modal */}
      <Dialog open={isVehicleModalOpen} onClose={() => setIsVehicleModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Vehicle Profile: {searchQuery.toUpperCase()}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Violation History</Typography>
          <List>
            <ListItem divider>
              <ListItemText primary="Speeding (85 km/h)" secondary="Highway 1 North • 2 days ago" />
              <Typography color="error.main" sx={{ fontWeight: 600 }}>UNPAID</Typography>
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Red Light Violation" secondary="City Center Junction • 1 month ago" />
              <Typography color="success.main" sx={{ fontWeight: 600 }}>PAID</Typography>
            </ListItem>
          </List>
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <span>Total Fines:</span>
              <span style={{ fontWeight: 600 }}>$1,200</span>
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Pending Amount:</span>
              <span style={{ fontWeight: 600, color: '#EF4444' }}>$400</span>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsVehicleModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={isNotifModalOpen} onClose={handleCloseNotifModal} maxWidth="sm" fullWidth>
        <DialogTitle>All Notifications</DialogTitle>
        <DialogContent dividers>
          <List>
            <ListItem divider>
              <ListItemText primary="Speeding detected" secondary="Highway 1 North • 2 mins ago" />
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Camera CAM-04 Offline" secondary="East Toll Plaza • 15 mins ago" />
            </ListItem>
            <ListItem>
              <ListItemText primary="System Update" secondary="Version 1.0.1 applied successfully • 2 hours ago" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotifModal}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
        slotProps={{ paper: { sx: { width: 220, mt: 1, boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', borderRadius: 2 } } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src="https://i.pravatar.cc/150?img=11" sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user?.name || 'Admin User'}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{user?.role || 'Admin'}</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={() => { handleProfileClose(); navigate('/settings'); }}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          My Account
        </MenuItem>
        <MenuItem onClick={() => { handleProfileClose(); navigate('/'); }}>
          <ListItemIcon><MapIcon fontSize="small" /></ListItemIcon>
          Exit to Landing Page
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon><DashboardIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      
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
