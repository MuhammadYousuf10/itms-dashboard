import { useState } from 'react';
import { 
  Box, Typography, Chip, IconButton, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import type { Column } from '../../components/common/DataTable';
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
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
import { useEffect } from 'react';
import TableSkeleton from '../../components/skeletons/TableSkeleton';

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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isLoading } = useQuery<{items: User[], total: number}>({
    queryKey: ['users', page, rowsPerPage, debouncedSearch],
    queryFn: async () => {
      const res = await axiosClient.get('/users/', {
        params: { skip: page * rowsPerPage, limit: rowsPerPage, search: debouncedSearch || undefined }
      });
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
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Failed to update user');
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
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Failed to delete user');
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

  const columns: Column<User>[] = [
    { id: 'full_name', label: 'Name', minWidth: 150, format: (value) => <Typography sx={{ fontWeight: 500 }}>{String(value)}</Typography> },
    { id: 'email', label: 'Email Address', minWidth: 200, format: (value) => <Typography sx={{ color: 'text.secondary' }}>{String(value)}</Typography> },
    {
      id: 'role',
      label: 'Role',
      minWidth: 120,
      format: (value: unknown) => {
        const role = value as string;
        return (
          <Chip 
            icon={role === 'ADMIN' ? <AdminIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
            label={role} 
            color={role === 'ADMIN' ? 'primary' : 'default'} 
            size="small" 
            variant="outlined"
            sx={{ fontWeight: 600, borderWidth: 2 }} 
          />
        );
      }
    },
    {
      id: 'is_active',
      label: 'Status',
      minWidth: 120,
      format: (value: unknown) => {
        const isActive = value as boolean;
        return (
          <Chip 
            label={isActive ? 'Active' : 'Suspended'} 
            color={isActive ? 'success' : 'error'} 
            size="small" 
            sx={{ fontWeight: 600 }} 
          />
        );
      }
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      minWidth: 80,
      format: (_, row: User) => (
        <IconButton size="small" onClick={(e) => handleOpenMenu(e, row)}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      )
    }
  ];

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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Team & Access Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage operator accounts, assign roles, and revoke access
          </Typography>
        </Box>
        <TextField
          variant="outlined"
          placeholder="Search name, email..."
          size="small"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            }
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {isLoading ? (
        <TableSkeleton rows={10} columns={7} />
      ) : (
        <DataTable
          columns={columns}
          data={data?.items || []}
          totalCount={data?.total || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      )}

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
