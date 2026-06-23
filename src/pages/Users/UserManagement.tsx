import { useState } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, IconButton, Menu, MenuItem, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon, 
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '../../api/axiosClient';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'OPERATOR';
  is_active: boolean;
}

export default function UserManagement() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogConfig, setDialogConfig] = useState<{ open: boolean, type: 'suspend' | 'delete' | null }>({ open: false, type: null });

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosClient.get('/users/');
      return res.data;
    },
    enabled: currentUser?.role?.toUpperCase() === 'ADMIN'
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<User> }) => {
      await axiosClient.patch(`/users/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
      setDialogConfig({ open: false, type: null });
      handleCloseMenu();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to update user');
      setDialogConfig({ open: false, type: null });
      handleCloseMenu();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
      setDialogConfig({ open: false, type: null });
      handleCloseMenu();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to delete user');
      setDialogConfig({ open: false, type: null });
      handleCloseMenu();
    }
  });

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleToggleRole = () => {
    if (!selectedUser) return;
    const newRole = selectedUser.role === 'ADMIN' ? 'OPERATOR' : 'ADMIN';
    updateMutation.mutate({ id: selectedUser.id, data: { role: newRole } });
  };

  const handleToggleStatus = () => {
    if (!selectedUser) return;
    // For reactivating, do it instantly without warning. For suspending, show warning.
    if (!selectedUser.is_active) {
      updateMutation.mutate({ id: selectedUser.id, data: { is_active: true } });
    } else {
      setDialogConfig({ open: true, type: 'suspend' });
    }
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    setDialogConfig({ open: true, type: 'delete' });
  };

  const confirmAction = () => {
    if (!selectedUser) return;
    if (dialogConfig.type === 'delete') {
      deleteMutation.mutate(selectedUser.id);
    } else if (dialogConfig.type === 'suspend') {
      updateMutation.mutate({ id: selectedUser.id, data: { is_active: false } });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  if (currentUser?.role?.toUpperCase() !== 'ADMIN') {
    return (
      <Box sx={{ flexGrow: 1, py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <BlockIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Access Restricted
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
          This page is restricted to Administrators only. You do not have the required permissions to view or manage team access.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Team & Access Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage operator accounts, assign roles, and revoke access
        </Typography>
      </Box>

      <Card sx={{ border: 1, borderColor: 'divider', boxShadow: 'none', borderRadius: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'background.default' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody component={motion.tbody} variants={containerVariants} initial="hidden" animate="show">
                {users.map((user) => (
                  <TableRow 
                    key={user.id} 
                    component={motion.tr} 
                    variants={itemVariants}
                    hover
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{user.full_name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={user.role === 'ADMIN' ? <AdminIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                        label={user.role} 
                        color={user.role === 'ADMIN' ? 'primary' : 'default'} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontWeight: 600, borderWidth: 2 }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.is_active ? 'Active' : 'Suspended'} 
                        color={user.is_active ? 'success' : 'error'} 
                        size="small" 
                        sx={{ fontWeight: 600 }} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleOpenMenu(e, user)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              mt: 1.5,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              minWidth: 180
            }
          }
        }}
      >
        {selectedUser?.id !== currentUser?.id && [
          <MenuItem key="role" onClick={handleToggleRole}>
            {selectedUser?.role === 'ADMIN' ? <PersonIcon sx={{ mr: 1, fontSize: 20 }} /> : <AdminIcon sx={{ mr: 1, fontSize: 20 }} />}
            Make {selectedUser?.role === 'ADMIN' ? 'Operator' : 'Admin'}
          </MenuItem>,
          <MenuItem key="status" onClick={handleToggleStatus} sx={{ color: selectedUser?.is_active ? 'warning.main' : 'success.main' }}>
            {selectedUser?.is_active ? <BlockIcon sx={{ mr: 1, fontSize: 20 }} /> : <CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />}
            {selectedUser?.is_active ? 'Suspend Account' : 'Reactivate Account'}
          </MenuItem>,
          <MenuItem key="delete" onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
            Permanently Delete
          </MenuItem>
        ]}
        {selectedUser?.id === currentUser?.id && (
          <MenuItem disabled>Cannot modify own account</MenuItem>
        )}
      </Menu>

      <Dialog
        open={dialogConfig.open}
        onClose={() => setDialogConfig({ open: false, type: null })}
        sx={{ '& .MuiDialog-paper': { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main', fontWeight: 700 }}>
          <WarningIcon />
          {dialogConfig.type === 'delete' ? 'Confirm Deletion' : 'Confirm Account Suspension'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.primary', mb: 1 }}>
            Are you absolutely sure you want to {dialogConfig.type === 'delete' ? 'permanently delete' : 'suspend'} the account for <strong>{selectedUser?.full_name}</strong>?
          </DialogContentText>
          <DialogContentText variant="body2" color="text.secondary">
            {dialogConfig.type === 'delete' 
              ? 'This action cannot be undone. All data associated with this user will be removed.'
              : 'The user will be instantly logged out and prevented from accessing the dashboard until reactivated.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setDialogConfig({ open: false, type: null })} 
            color="inherit" 
            sx={{ fontWeight: 600 }}
            disabled={updateMutation.isPending || deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmAction} 
            color="error" 
            variant="contained" 
            sx={{ fontWeight: 600, boxShadow: 'none' }}
            disabled={updateMutation.isPending || deleteMutation.isPending}
          >
            {(updateMutation.isPending || deleteMutation.isPending) ? 'Processing...' : `Yes, ${dialogConfig.type === 'delete' ? 'Delete' : 'Suspend'}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
