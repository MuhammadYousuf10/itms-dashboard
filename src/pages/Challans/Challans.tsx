import { useState, useEffect } from 'react';
import { 
  Box, Typography, Chip, IconButton, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, Tooltip, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WarningIcon from '@mui/icons-material/Warning';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FeedbackIcon from '@mui/icons-material/Feedback';
import GavelIcon from '@mui/icons-material/Gavel';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import DataTable from '../../components/common/DataTable';
import TableSkeleton from '../../components/skeletons/TableSkeleton';
import type { Column } from '../../components/common/DataTable';
import { axiosClient } from '../../api/axiosClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';

interface ChallanRow {
  id: string;
  plate: string;
  violationType: string;
  cameraId: string;
  fineAmount: number;
  status: 'PENDING' | 'PAID' | 'WARNING' | 'CANCELLED' | 'CANCELLATION_REQUESTED' | 'DISPUTED';
  date: string;
  cancellationReason?: string;
  disputeReason?: string;
  disputeEvidenceUrl?: string;
}

type DialogType = 'warning' | 'cancel' | 'delete' | 'request_cancel' | 'approve_cancel' | 'reject_cancel' | 'review_dispute' | null;

export default function Challans() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const isAdmin = currentUser?.role?.toUpperCase() === 'ADMIN';

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedChallan, setSelectedChallan] = useState<ChallanRow | null>(null);

  // Dialog state
  const [dialogConfig, setDialogConfig] = useState<{ open: boolean, type: DialogType }>({ open: false, type: null });
  const [cancelReason, setCancelReason] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(0); // Reset to page 0 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isLoading: loading, error } = useQuery<{items: ChallanRow[], total: number}, Error>({
    queryKey: ['challans', page, rowsPerPage, debouncedSearch],
    queryFn: async () => {
      const response = await axiosClient.get('/challans', {
        params: { skip: page * rowsPerPage, limit: rowsPerPage, search: debouncedSearch || undefined }
      });
      return {
        items: response.data.items.map((item: any) => ({
          id: item.id,
          plate: item.vehicle_plate,
          violationType: item.violation_type,
          cameraId: item.camera_id,
          fineAmount: item.fine_amount,
          status: item.status,
          date: new Date(item.date_issued).toLocaleDateString(),
          cancellationReason: item.cancellation_reason,
          disputeReason: item.dispute_reason,
          disputeEvidenceUrl: item.dispute_evidence_url
        })),
        total: response.data.total
      };
    }
  });

  const tableData = data?.items || [];
  const totalCount = data?.total || 0;

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await axiosClient.patch(`/challans/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challans'] });
      toast.success('Challan status updated successfully');
      setDialogConfig({ open: false, type: null });
      handleCloseMenu();
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Action failed');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.delete(`/challans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challans'] });
      toast.success('Challan deleted successfully');
      setDialogConfig({ open: false, type: null });
      handleCloseMenu();
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Failed to delete challan');
    }
  });

  const requestCancelMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string, reason: string }) => {
      await axiosClient.post(`/challans/${id}/request-cancel`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challans'] });
      toast.success('Cancellation request submitted to Admin');
      setDialogConfig({ open: false, type: null });
      setCancelReason('');
      handleCloseMenu();
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Failed to request cancellation');
    }
  });

  const approveCancelMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.post(`/challans/${id}/approve-cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challans'] });
      toast.success('Dispute/Cancellation approved');
      setDialogConfig({ open: false, type: null });
      handleCloseMenu();
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Failed to approve');
    }
  });

  const rejectCancelMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.post(`/challans/${id}/reject-cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challans'] });
      toast.success('Dispute/Request rejected');
      setDialogConfig({ open: false, type: null });
      handleCloseMenu();
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Failed to reject');
    }
  });

  useEffect(() => {
    if (error) {
      toast.error(`Failed to load challans: ${error.message}`);
    }
  }, [error]);

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, row: ChallanRow) => {
    setAnchorEl(event.currentTarget);
    setSelectedChallan(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedChallan(null);
  };

  const confirmAction = () => {
    if (!selectedChallan) return;
    
    if (dialogConfig.type === 'delete') {
      deleteMutation.mutate(selectedChallan.id);
    } else if (dialogConfig.type === 'warning') {
      updateStatusMutation.mutate({ id: selectedChallan.id, status: 'WARNING' });
    } else if (dialogConfig.type === 'cancel') {
      updateStatusMutation.mutate({ id: selectedChallan.id, status: 'CANCELLED' });
    } else if (dialogConfig.type === 'request_cancel') {
      requestCancelMutation.mutate({ id: selectedChallan.id, reason: cancelReason });
    } else if (dialogConfig.type === 'approve_cancel') {
      approveCancelMutation.mutate(selectedChallan.id);
    } else if (dialogConfig.type === 'reject_cancel') {
      rejectCancelMutation.mutate(selectedChallan.id);
    }
  };

  const columns: Column<ChallanRow>[] = [
    { id: 'id', label: 'Challan ID', minWidth: 100 },
    { id: 'plate', label: 'Vehicle Plate', minWidth: 120 },
    { id: 'violationType', label: 'Violation Type', minWidth: 150 },
    { id: 'cameraId', label: 'Camera Node', minWidth: 120 },
    {
      id: 'fineAmount',
      label: 'Fine Amount',
      minWidth: 120,
      format: (value) => `$${value}`
    },
    { id: 'date', label: 'Date Issued', minWidth: 150 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (value, row) => {
        let color: 'success' | 'warning' | 'info' | 'default' | 'error' | 'secondary' = 'warning';
        let label = value as string;
        
        if (value === 'PAID') color = 'success';
        if (value === 'WARNING') color = 'info';
        if (value === 'CANCELLED') color = 'default';
        if (value === 'CANCELLATION_REQUESTED') {
          color = 'error';
          label = 'REVIEW PENDING';
        }
        if (value === 'DISPUTED') {
          color = 'secondary';
          label = 'CITIZEN DISPUTED';
        }
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={label}
              size="small"
              color={color}
              sx={{ fontWeight: 600, borderRadius: 1 }}
            />
            {value === 'CANCELLATION_REQUESTED' && (
              <Tooltip title={`Operator Reason: ${row.cancellationReason}`}>
                <HelpIcon fontSize="small" color="action" />
              </Tooltip>
            )}
            {value === 'DISPUTED' && (
              <Tooltip title={`Citizen Reason: ${row.disputeReason}`}>
                <GavelIcon fontSize="small" color="secondary" />
              </Tooltip>
            )}
          </Box>
        );
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 80,
      align: 'center',
      format: (_, row) => (
        <IconButton size="small" onClick={(e) => handleOpenMenu(e, row)}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      )
    }
  ];

  const isPendingMutation = updateStatusMutation.isPending || deleteMutation.isPending || requestCancelMutation.isPending || approveCancelMutation.isPending || rejectCancelMutation.isPending;

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Challans Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage all issued traffic violation tickets
          </Typography>
        </Box>
        <TextField
          variant="outlined"
          placeholder="Search plate, violation, ID..."
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

      {loading ? (
        <TableSkeleton rows={10} columns={8} />
      ) : (
        <DataTable
          columns={columns}
          data={tableData}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        sx={{ '& .MuiMenu-paper': { borderRadius: 2, minWidth: 180, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
      >
        {!isAdmin && (
          <MenuItem 
            onClick={() => setDialogConfig({ open: true, type: 'request_cancel' })}
            disabled={selectedChallan?.status !== 'PENDING'}
          >
            <FeedbackIcon sx={{ mr: 1, fontSize: 20, color: 'info.main' }} />
            Request Cancellation
          </MenuItem>
        )}

        {isAdmin && selectedChallan?.status === 'DISPUTED' && [
          <MenuItem key="review" onClick={() => setDialogConfig({ open: true, type: 'review_dispute' })}>
            <FindInPageIcon sx={{ mr: 1, fontSize: 20, color: 'secondary.main' }} />
            Review Dispute
          </MenuItem>
        ]}

        {isAdmin && selectedChallan?.status === 'CANCELLATION_REQUESTED' && [
          <MenuItem key="approve" onClick={() => setDialogConfig({ open: true, type: 'approve_cancel' })}>
            <CheckCircleIcon sx={{ mr: 1, fontSize: 20, color: 'success.main' }} />
            Approve Cancellation
          </MenuItem>,
          <MenuItem key="reject" onClick={() => setDialogConfig({ open: true, type: 'reject_cancel' })}>
            <CancelIcon sx={{ mr: 1, fontSize: 20, color: 'error.main' }} />
            Reject Request
          </MenuItem>
        ]}

        {isAdmin && selectedChallan?.status !== 'CANCELLATION_REQUESTED' && selectedChallan?.status !== 'DISPUTED' && [
          <MenuItem 
            key="warn"
            onClick={() => setDialogConfig({ open: true, type: 'warning' })}
            disabled={selectedChallan?.status === 'WARNING' || selectedChallan?.status === 'CANCELLED' || selectedChallan?.status === 'PAID'}
          >
            <WarningIcon sx={{ mr: 1, fontSize: 20, color: 'info.main' }} />
            Convert to Warning
          </MenuItem>,
          <MenuItem 
            key="cancel"
            onClick={() => setDialogConfig({ open: true, type: 'cancel' })}
            disabled={selectedChallan?.status === 'CANCELLED' || selectedChallan?.status === 'PAID'}
          >
            <CancelIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
            Cancel Challan
          </MenuItem>,
          <MenuItem key="delete" onClick={() => setDialogConfig({ open: true, type: 'delete' })}>
            <DeleteIcon sx={{ mr: 1, fontSize: 20, color: 'error.main' }} />
            <Typography color="error.main">Delete Record</Typography>
          </MenuItem>
        ]}
      </Menu>

      {/* Confirmation & Review Dialog */}
      <Dialog
        open={dialogConfig.open}
        onClose={() => setDialogConfig({ open: false, type: null })}
        maxWidth={dialogConfig.type === 'review_dispute' ? 'md' : 'xs'}
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 3, p: dialogConfig.type === 'review_dispute' ? 2 : 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: dialogConfig.type === 'delete' || dialogConfig.type === 'reject_cancel' ? 'error.main' : 'primary.main', fontWeight: 700 }}>
          {dialogConfig.type === 'delete' && <WarningIcon />}
          {dialogConfig.type === 'warning' && 'Issue Warning'}
          {dialogConfig.type === 'cancel' && 'Cancel Challan'}
          {dialogConfig.type === 'delete' && 'Delete Challan'}
          {dialogConfig.type === 'request_cancel' && 'Request Cancellation'}
          {dialogConfig.type === 'approve_cancel' && 'Approve Request'}
          {dialogConfig.type === 'reject_cancel' && 'Reject Request'}
          {dialogConfig.type === 'review_dispute' && 'Review Citizen Dispute'}
        </DialogTitle>
        
        <DialogContent>
          {dialogConfig.type !== 'review_dispute' && (
            <DialogContentText sx={{ color: 'text.primary', mb: 1 }}>
              {dialogConfig.type === 'request_cancel' && 'Please provide a valid reason for cancelling this challan.'}
              {dialogConfig.type === 'approve_cancel' && 'Are you sure you want to approve this request? The challan will be cancelled.'}
              {dialogConfig.type === 'reject_cancel' && 'Are you sure you want to reject this request? The challan will remain pending.'}
              {['delete', 'cancel', 'warning'].includes(dialogConfig.type || '') && (
                <>Are you sure you want to {dialogConfig.type === 'delete' ? 'permanently delete' : dialogConfig.type === 'cancel' ? 'cancel' : 'convert to a warning'} the challan for vehicle <strong>{selectedChallan?.plate}</strong>?</>
              )}
            </DialogContentText>
          )}

          {dialogConfig.type === 'review_dispute' && selectedChallan && (
            <Box>
              <Box sx={{ mb: 3, p: 3, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Citizen's Reason:</Typography>
                <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>"{selectedChallan.disputeReason}"</Typography>
              </Box>

              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Uploaded Evidence:</Typography>
              {selectedChallan.disputeEvidenceUrl ? (
                <Box sx={{ mt: 1, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider', bgcolor: '#000', display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src={`http://localhost:8000${selectedChallan.disputeEvidenceUrl}`} 
                    alt="Citizen Evidence" 
                    style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} 
                  />
                </Box>
              ) : (
                <Box sx={{ mt: 1, p: 4, borderRadius: 2, border: '1px dashed', borderColor: 'divider', textAlign: 'center', bgcolor: 'background.default' }}>
                  <Typography color="text.secondary">No visual evidence provided.</Typography>
                </Box>
              )}
            </Box>
          )}
          
          {(dialogConfig.type === 'approve_cancel' || dialogConfig.type === 'reject_cancel') && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>OPERATOR REASON:</Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>{selectedChallan?.cancellationReason}</Typography>
            </Box>
          )}

          {dialogConfig.type === 'request_cancel' && (
            <TextField
              autoFocus
              margin="dense"
              label="Cancellation Reason"
              type="text"
              fullWidth
              variant="outlined"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              multiline
              rows={3}
              sx={{ mt: 2 }}
            />
          )}

          {dialogConfig.type !== 'review_dispute' && (
            <DialogContentText variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {dialogConfig.type === 'delete' && 'This action cannot be undone. All data associated with this challan will be removed from the database.'}
              {dialogConfig.type === 'cancel' && 'The citizen will not have to pay the fine, but this action will be permanently recorded in the system.'}
            </DialogContentText>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: dialogConfig.type === 'review_dispute' ? 3 : 2 }}>
          {dialogConfig.type === 'review_dispute' ? (
            <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
              <Button 
                onClick={() => setDialogConfig({ open: false, type: null })} 
                color="inherit" 
                sx={{ fontWeight: 600, flex: 1 }}
                disabled={isPendingMutation}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => rejectCancelMutation.mutate(selectedChallan!.id)} 
                color="error" 
                variant="outlined" 
                sx={{ fontWeight: 600, flex: 1 }}
                disabled={isPendingMutation}
              >
                Reject Dispute
              </Button>
              <Button 
                onClick={() => approveCancelMutation.mutate(selectedChallan!.id)} 
                color="success" 
                variant="contained" 
                sx={{ fontWeight: 600, boxShadow: 'none', flex: 1 }}
                disabled={isPendingMutation}
              >
                Approve Dispute
              </Button>
            </Box>
          ) : (
            <>
              <Button 
                onClick={() => { setDialogConfig({ open: false, type: null }); setCancelReason(''); }} 
                color="inherit" 
                sx={{ fontWeight: 600 }}
                disabled={isPendingMutation}
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmAction} 
                color={dialogConfig.type === 'delete' || dialogConfig.type === 'reject_cancel' ? 'error' : 'primary'} 
                variant="contained" 
                sx={{ fontWeight: 600, boxShadow: 'none' }}
                disabled={isPendingMutation || (dialogConfig.type === 'request_cancel' && !cancelReason.trim())}
              >
                {isPendingMutation ? 'Processing...' : 'Confirm'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

    </Box>
  );
}
