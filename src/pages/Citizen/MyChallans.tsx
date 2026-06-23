import { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Chip, Button, Divider, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, CircularProgress, Alert,
  IconButton, Grid, Stepper, Step, StepLabel, Fade, alpha
} from '@mui/material';

import PaymentIcon from '@mui/icons-material/Payment';
import DisputeIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VerifiedIcon from '@mui/icons-material/Verified';
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
    <Box sx={{ pb: 8 }}>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1px' }}>My Challans</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Vehicle Record for <Chip label={plate} size="small" color="primary" sx={{ fontWeight: 800, borderRadius: 1 }} />
          </Typography>
        </Box>
        <Button variant="outlined" color="inherit" size="small" sx={{ borderRadius: 2, textTransform: 'none' }} onClick={() => { sessionStorage.clear(); navigate('/citizen'); }}>
          Look up different vehicle
        </Button>
      </Box>

      {/* Citizen Overview Dashboard */}
      {!isLoading && challans.length > 0 && (
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', 
              color: 'white', 
              borderRadius: 4, 
              boxShadow: '0 20px 40px -10px rgba(239, 68, 68, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <AccountBalanceWalletIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 140, opacity: 0.15, transform: 'rotate(-15deg)' }} />
              <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Total Unpaid Fines</Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, my: 1, letterSpacing: '-2px' }}>
                  ${challans.filter(c => c.status === 'PENDING').reduce((acc, curr) => acc + curr.fineAmount, 0)}
                </Typography>
                <Chip 
                  label={`${challans.filter(c => c.status === 'PENDING').length} pending violations`} 
                  size="small" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, backdropFilter: 'blur(10px)' }} 
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
              color: 'white', 
              borderRadius: 4,
              boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <VerifiedIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 140, opacity: 0.15, transform: 'rotate(-15deg)' }} />
              <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Total Paid Fines</Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, my: 1, letterSpacing: '-2px' }}>
                  ${challans.filter(c => c.status === 'PAID').reduce((acc, curr) => acc + curr.fineAmount, 0)}
                </Typography>
                <Chip 
                  label={`${challans.filter(c => c.status === 'PAID').length} resolved violations`} 
                  size="small" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, backdropFilter: 'blur(10px)' }} 
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', 
              color: 'white', 
              borderRadius: 4,
              boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <WarningAmberIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 140, opacity: 0.15, transform: 'rotate(-15deg)' }} />
              <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Active Disputes</Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, my: 1, letterSpacing: '-2px' }}>
                  {challans.filter(c => c.status === 'CANCELLATION_REQUESTED' || c.status === 'DISPUTED').length}
                </Typography>
                <Chip 
                  label="Under review by administrator" 
                  size="small" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, backdropFilter: 'blur(10px)' }} 
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {challans.length === 0 ? (
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          Great news! You have no traffic violations on record for this vehicle.
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          {challans.map((challan) => {
            const isPaid = challan.status === 'PAID';
            const isPending = challan.status === 'PENDING';
            const isDisputed = challan.status === 'CANCELLATION_REQUESTED' || challan.status === 'DISPUTED';
            
            let statusColor = 'default';
            if (isPaid) statusColor = 'success.main';
            if (isPending) statusColor = 'error.main';
            if (isDisputed) statusColor = 'warning.main';

            return (
              <Box key={challan.id}>
                <Card sx={{ 
                  borderRadius: 4, 
                  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)', 
                  border: 1, 
                  borderColor: 'divider',
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.12)' }
                }}>
                  {/* Left Accent Bar */}
                  <Box sx={{ position: 'absolute', left: -1, top: 20, bottom: 20, width: 4, bgcolor: statusColor, borderRadius: '0 4px 4px 0' }} />
                  
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, mb: 0.5, display: 'block' }}>
                          Violation Type
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>{challan.violationType}</Typography>
                      </Box>
                      <Chip 
                        label={isDisputed ? 'DISPUTED' : challan.status} 
                        sx={{ 
                          fontWeight: 800, 
                          borderRadius: 2,
                          bgcolor: alpha(
                            isPaid ? '#10b981' : isPending ? '#ef4444' : isDisputed ? '#f59e0b' : '#6b7280', 
                            0.1
                          ),
                          color: isPaid ? '#047857' : isPending ? '#b91c1c' : isDisputed ? '#b45309' : '#374151',
                          border: 1,
                          borderColor: alpha(
                            isPaid ? '#10b981' : isPending ? '#ef4444' : isDisputed ? '#f59e0b' : '#6b7280', 
                            0.2
                          )
                        }} 
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 5, mb: 4, bgcolor: 'background.default', p: 2, borderRadius: 3 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Challan ID</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9rem' }}>{challan.id}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Date Issued</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{challan.date}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Fine Amount</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 900, color: statusColor, fontSize: '1.1rem' }}>${challan.fineAmount}</Typography>
                      </Box>
                    </Box>

                    {/* Dispute Tracking Timeline */}
                    {isDisputed && (
                      <Box sx={{ mb: 4, p: 3, bgcolor: alpha('#f59e0b', 0.05), borderRadius: 3, border: 1, borderColor: alpha('#f59e0b', 0.2) }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: '#b45309' }}>Dispute Status</Typography>
                        <Stepper activeStep={1} alternativeLabel>
                          <Step>
                            <StepLabel>Dispute Filed</StepLabel>
                          </Step>
                          <Step>
                            <StepLabel>Under Review</StepLabel>
                          </Step>
                          <Step>
                            <StepLabel>Final Verdict</StepLabel>
                          </Step>
                        </Stepper>
                      </Box>
                    )}

                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Button 
                        variant="outlined" 
                        color="inherit"
                        size="medium" 
                        startIcon={<CameraIcon />}
                        onClick={() => { setSelectedChallan(challan); setDialogType('evidence'); }}
                        sx={{ borderRadius: 2, fontWeight: 600, borderColor: 'divider', '&:hover': { bgcolor: 'background.default' } }}
                      >
                        Evidence
                      </Button>
                      
                      {isPending && (
                        <>
                          <Button 
                            variant="text" 
                            color="inherit" 
                            size="medium" 
                            startIcon={<DisputeIcon />}
                            onClick={() => { setSelectedChallan(challan); setDialogType('dispute'); }}
                            sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: 'warning.main', bgcolor: alpha('#f59e0b', 0.1) } }}
                          >
                            Dispute
                          </Button>
                          <Button 
                            variant="contained" 
                            color="error" 
                            size="medium" 
                            startIcon={<PaymentIcon />}
                            onClick={() => { setSelectedChallan(challan); setDialogType('pay'); }}
                            sx={{ borderRadius: 2, ml: 'auto', boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)', fontWeight: 700, px: 3 }}
                          >
                            Pay Now
                          </Button>
                        </>
                      )}
                      {isPaid && (
                        <Button 
                          variant="contained" 
                          color="success" 
                          size="medium" 
                          startIcon={<CheckCircleIcon />}
                          onClick={() => window.print()}
                          sx={{ ml: 'auto', borderRadius: 2, boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', fontWeight: 700, px: 3 }}
                        >
                          Receipt
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Payment Modal */}
      <Dialog open={dialogType === 'pay'} onClose={() => !payMutation.isPending && setDialogType(null)} sx={{ '& .MuiDialog-paper': { borderRadius: 3, p: 0, minWidth: 400, overflow: 'hidden' } }}>
        <Box sx={{ bgcolor: 'primary.main', p: 3, color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Complete Payment</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Secure Checkout</Typography>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Total Due</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>${selectedChallan?.fineAmount}</Typography>
            </Box>
            <Chip label={selectedChallan?.id} size="small" />
          </Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Payment Details</Typography>
          <TextField fullWidth label="Card Number" defaultValue="4242 4242 4242 4242" sx={{ mb: 2 }} disabled={payMutation.isPending} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="MM/YY" defaultValue="12/26" disabled={payMutation.isPending} />
            <TextField label="CVC" defaultValue="123" disabled={payMutation.isPending} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setDialogType(null)} disabled={payMutation.isPending} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => selectedChallan && payMutation.mutate(selectedChallan.id)} 
            disabled={payMutation.isPending}
            sx={{ px: 4, py: 1.5, borderRadius: 2, boxShadow: 'none' }}
          >
            {payMutation.isPending ? <CircularProgress size={24} color="inherit" /> : `Pay $${selectedChallan?.fineAmount}`}
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
        <Box sx={{ bgcolor: '#000', height: 450, position: 'relative', overflow: 'hidden' }}>
          {/* Realistic Traffic Camera Image */}
          <Box 
            component="img" 
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?q=80&w=1000" 
            sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
          />
          
          {/* Fake AI Bounding Box */}
          <Fade in={true} timeout={1500}>
            <Box sx={{ 
              position: 'absolute', 
              top: '40%', 
              left: '45%', 
              width: '120px', 
              height: '80px', 
              border: '2px solid #ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)'
            }}>
              <Box sx={{ position: 'absolute', top: -25, left: -2, bgcolor: '#ef4444', color: 'white', px: 1, fontSize: '0.75rem', fontWeight: 700 }}>
                {selectedChallan?.plate} ({selectedChallan?.violationType})
              </Box>
            </Box>
          </Fade>

          {/* Camera Metadata Overlay */}
          <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1 }}>
            <Chip size="small" label="LIVE EVIDENCE" color="error" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
          </Box>
          <Box sx={{ position: 'absolute', bottom: 16, left: 16, bgcolor: 'rgba(0,0,0,0.8)', p: 1.5, borderRadius: 1, border: '1px solid rgba(255,255,255,0.2)' }}>
            <Typography variant="caption" color="white" sx={{ fontFamily: 'monospace', display: 'block' }}>
              TARGET: {selectedChallan?.plate}
            </Typography>
            <Typography variant="caption" color="white" sx={{ fontFamily: 'monospace', display: 'block' }}>
              CAM_ID: {selectedChallan?.cameraId || 'CAM-01'}
            </Typography>
            <Typography variant="caption" color="white" sx={{ fontFamily: 'monospace', display: 'block' }}>
              TIMESTAMP: {selectedChallan?.date}
            </Typography>
          </Box>
        </Box>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogType(null)} variant="contained" color="inherit">Close Evidence View</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
