import { useState } from 'react';
import { Box, Card, CardContent, Typography, Divider, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Gavel, CheckCircle, Cancel, Image as ImageIcon } from '@mui/icons-material';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '../../../api/axiosClient';
import toast from 'react-hot-toast';

export default function QuickDisputesWidget({ disputes }: { disputes: any[] }) {
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; action: 'approve' | 'reject'; disputeId: string | null }>({ isOpen: false, action: 'approve', disputeId: null });
  const [evidenceModal, setEvidenceModal] = useState<{ isOpen: boolean; url: string | null }>({ isOpen: false, url: null });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.post(`/challans/${id}/approve-cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Dispute approved and challan cancelled.');
    },
    onError: () => toast.error('Failed to approve dispute.')
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.post(`/challans/${id}/reject-cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Dispute rejected. Challan status restored.');
    },
    onError: () => toast.error('Failed to reject dispute.')
  });

  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper', backgroundImage: 'none', border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Gavel color="warning" /> Quick Dispute Queue
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{disputes?.length || 0} PENDING</Typography>
      </Box>
      <CardContent sx={{ p: 0 }}>
        {disputes?.map((dispute, i) => (
          <Box key={i}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '&:hover': { bgcolor: 'action.hover' } }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{dispute.plate}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{dispute.id}</Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: 'text.primary', fontWeight: 500 }}>"{dispute.reason}"</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {dispute.evidence_url && (
                  <Tooltip title="View Evidence">
                    <IconButton 
                      color="info" 
                      size="small" 
                      sx={{ border: '1px solid', borderColor: 'info.main' }}
                      onClick={() => setEvidenceModal({ isOpen: true, url: dispute.evidence_url })}
                    >
                      <ImageIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Approve Dispute">
                  <IconButton 
                    color="success" 
                    size="small" 
                    sx={{ border: '1px solid', borderColor: 'success.main' }}
                    onClick={() => setConfirmDialog({ isOpen: true, action: 'approve', disputeId: dispute.id })}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                  >
                    <CheckCircle fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject Dispute">
                  <IconButton 
                    color="error" 
                    size="small" 
                    sx={{ border: '1px solid', borderColor: 'error.main' }}
                    onClick={() => setConfirmDialog({ isOpen: true, action: 'reject', disputeId: dispute.id })}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                  >
                    <Cancel fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            {i < disputes.length - 1 && <Divider />}
          </Box>
        ))}
        {(!disputes || disputes.length === 0) && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No pending disputes.</Typography>
          </Box>
        )}
      </CardContent>

      <ConfirmDialog 
        open={confirmDialog.isOpen}
        title={confirmDialog.action === 'approve' ? 'Approve Dispute?' : 'Reject Dispute?'}
        message={confirmDialog.action === 'approve' 
          ? 'Are you sure you want to approve this dispute? The challan will be officially cancelled and the citizen will not be required to pay the fine.'
          : 'Are you sure you want to reject this dispute? The challan status will be restored, and the citizen will be required to pay the fine.'
        }
        confirmText={confirmDialog.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
        variant={confirmDialog.action === 'approve' ? 'success' : 'error'}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={() => {
          if (confirmDialog.action === 'approve') {
            approveMutation.mutate(confirmDialog.disputeId!);
          } else {
            rejectMutation.mutate(confirmDialog.disputeId!);
          }
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }}
      />

      {/* Evidence Image Modal */}
      <Dialog open={evidenceModal.isOpen} onClose={() => setEvidenceModal({ isOpen: false, url: null })} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Dispute Evidence</DialogTitle>
        <DialogContent dividers sx={{ p: 0, bgcolor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          {evidenceModal.url ? (
            <img src={evidenceModal.url.startsWith('http') ? evidenceModal.url : `http://localhost:8000${evidenceModal.url}`} alt="Evidence" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
          ) : (
            <Typography color="white">No image available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEvidenceModal({ isOpen: false, url: null })} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
