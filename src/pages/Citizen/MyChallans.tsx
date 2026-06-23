import { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Chip, Button, Divider, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, CircularProgress, Alert,
  IconButton
} from '@mui/material';

import PaymentIcon from '@mui/icons-material/Payment';
import DisputeIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { axiosClient } from '../../api/axiosClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ChallanRow {
  id: string;
  plate: string;
  violationType: string;
  fineAmount: number;
  status: 'PENDING' | 'PAID' | 'WARNING' | 'CANCELLED' | 'CANCELLATION_REQUESTED' | 'DISPUTED';
  date: string;
  cameraId?: string;
}

export default function MyChallans() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const plate = sessionStorage.getItem('citizen_plate');
  
  const [selectedChallan, setSelectedChallan] = useState<ChallanRow | null>(null);
  const [dialogType, setDialogType] = useState<'pay' | 'dispute' | 'evidence' | null>(null);
  
  // Dispute State
  const [disputeReason, setDisputeReason] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!plate) {
      navigate('/citizen');
    }
  }, [plate, navigate]);

  const { data: challans = [], isLoading } = useQuery<ChallanRow[], Error>({
    queryKey: ['citizen_challans', plate],
    queryFn: async () => {
      const response = await axiosClient.get(`/citizen/challans/${plate}`);
      return response.data.map((item: any) => ({
        id: item.id,
        plate: item.vehicle_plate,
        violationType: item.violation_type,
        fineAmount: item.fine_amount,
        status: item.status,
        date: new Date(item.date_issued).toLocaleDateString(),
        cameraId: item.camera_id,
      }));
    },
    enabled: !!plate
  });

  const payMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulate payment delay
      await new Promise(r => setTimeout(r, 1500));
      await axiosClient.post(`/citizen/challans/${id}/pay`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizen_challans', plate] });
      toast.success('Payment successful! Receipt generated.');
      setDialogType(null);
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Payment failed');
    }
  });

  const disputeMutation = useMutation({
    mutationFn: async ({ id, reason, evidence_url }: { id: string, reason: string, evidence_url?: string }) => {
      await axiosClient.post(`/citizen/challans/${id}/dispute`, { reason, evidence_url });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizen_challans', plate] });
      toast.success('Dispute submitted successfully. An Admin will review your case.');
      setDialogType(null);
      setDisputeReason('');
      setEvidenceFile(null);
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Failed to submit dispute');
    }
  });

  const handleDisputeSubmit = async () => {
    if (!selectedChallan) return;
    
    let evidence_url = undefined;
    
    // Upload file first if exists
    if (evidenceFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', evidenceFile);
        const uploadRes = await axiosClient.post('/citizen/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        evidence_url = uploadRes.data.url;
      } catch (_error) {
        toast.error('Failed to upload evidence image.');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }
    
    disputeMutation.mutate({ id: selectedChallan.id, reason: disputeReason, evidence_url });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEvidenceFile(e.target.files[0]);
    }
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>My Challans</Typography>
          <Typography variant="body1" color="text.secondary">
            Vehicle: <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{plate}</Typography>
          </Typography>
        </Box>
        <Button variant="text" onClick={() => { sessionStorage.clear(); navigate('/citizen'); }}>
          Look up different vehicle
        </Button>
      </Box>

      {challans.length === 0 ? (
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          Great news! You have no traffic violations on record for this vehicle.
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {challans.map((challan) => (
            <Box key={challan.id}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 1, borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{challan.violationType}</Typography>
                    <Chip 
                      label={challan.status === 'CANCELLATION_REQUESTED' ? 'DISPUTED' : challan.status} 
                      color={
                        challan.status === 'PAID' ? 'success' : 
                        (challan.status === 'PENDING' ? 'warning' : 'default')
                      } 
                      size="small" 
                      sx={{ fontWeight: 700, borderRadius: 1 }} 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Challan ID</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{challan.id}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Date Issued</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{challan.date}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Fine Amount</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: 'error.main' }}>${challan.fineAmount}</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<CameraIcon />}
                      onClick={() => { setSelectedChallan(challan); setDialogType('evidence'); }}
                      sx={{ borderRadius: 2 }}
                    >
                      View Evidence
                    </Button>
                    
                    {challan.status === 'PENDING' && (
                      <>
                        <Button 
                          variant="outlined" 
                          color="inherit" 
                          size="small" 
                          startIcon={<DisputeIcon />}
                          onClick={() => { setSelectedChallan(challan); setDialogType('dispute'); }}
                          sx={{ borderRadius: 2 }}
                        >
                          Dispute
                        </Button>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="small" 
                          startIcon={<PaymentIcon />}
                          onClick={() => { setSelectedChallan(challan); setDialogType('pay'); }}
                          sx={{ borderRadius: 2, ml: 'auto', boxShadow: 'none' }}
                        >
                          Pay Now
                        </Button>
                      </>
                    )}
                    {challan.status === 'PAID' && (
                      <Button 
                        variant="text" 
                        color="success" 
                        size="small" 
                        startIcon={<CheckCircleIcon />}
                        sx={{ ml: 'auto' }}
                      >
                        Download Receipt
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Payment Modal */}
      <Dialog open={dialogType === 'pay'} onClose={() => !payMutation.isPending && setDialogType(null)} sx={{ '& .MuiDialog-paper': { borderRadius: 3, p: 2, minWidth: 400 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Pay Traffic Fine</DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Total Due:</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>${selectedChallan?.fineAmount}</Typography>
          </Box>
          <TextField fullWidth label="Card Number" defaultValue="4242 4242 4242 4242" sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="MM/YY" defaultValue="12/26" />
            <TextField label="CVC" defaultValue="123" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogType(null)} disabled={payMutation.isPending}>Cancel</Button>
          <Button variant="contained" onClick={() => selectedChallan && payMutation.mutate(selectedChallan.id)} disabled={payMutation.isPending}>
            {payMutation.isPending ? 'Processing...' : `Pay $${selectedChallan?.fineAmount}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dispute Modal */}
      <Dialog open={dialogType === 'dispute'} onClose={() => !isUploading && setDialogType(null)} sx={{ '& .MuiDialog-paper': { borderRadius: 3, p: 2, minWidth: 500 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: 'warning.main' }}>Submit Dispute</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            If you believe this challan was issued in error, explain your reasoning and upload any photographic evidence below. An administrator will review your case.
          </DialogContentText>
          
          <TextField 
            fullWidth 
            multiline 
            rows={4} 
            label="Dispute Reason (Required)" 
            placeholder="e.g. This is not my vehicle, the plate was misread."
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 2, p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
            {!evidenceFile ? (
              <>
                <UploadFileIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Upload Evidence Photo (Optional)</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Supported formats: JPG, PNG</Typography>
                <Button variant="outlined" component="label">
                  Select File
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.paper', p: 2, borderRadius: 1, border: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CameraIcon color="primary" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{evidenceFile.name}</Typography>
                </Box>
                <IconButton size="small" color="error" onClick={() => setEvidenceFile(null)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogType(null)} color="inherit" disabled={isUploading || disputeMutation.isPending}>Cancel</Button>
          <Button 
            variant="contained" 
            color="warning" 
            onClick={handleDisputeSubmit} 
            disabled={!disputeReason.trim() || isUploading || disputeMutation.isPending}
            sx={{ boxShadow: 'none' }}
          >
            {isUploading ? 'Uploading Evidence...' : disputeMutation.isPending ? 'Submitting...' : 'Submit Dispute'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Evidence Modal */}
      <Dialog open={dialogType === 'evidence'} onClose={() => setDialogType(null)} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 3, overflow: 'hidden' } }}>
        <Box sx={{ bgcolor: '#000', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Dummy Evidence Image */}
          <Typography color="white" sx={{ opacity: 0.5 }}>Traffic Camera Snapshot Unavailable</Typography>
          <Box sx={{ position: 'absolute', bottom: 16, left: 16, bgcolor: 'rgba(0,0,0,0.7)', p: 1, borderRadius: 1 }}>
            <Typography variant="caption" color="white" sx={{ fontFamily: 'monospace' }}>
              PLATE: {selectedChallan?.plate} | CAM: {selectedChallan?.cameraId} | DATE: {selectedChallan?.date}
            </Typography>
          </Box>
        </Box>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogType(null)} variant="contained" color="inherit">Close Evidence</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
