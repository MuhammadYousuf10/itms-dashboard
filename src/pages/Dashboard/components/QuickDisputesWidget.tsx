import { Box, Card, CardContent, Typography, Divider, IconButton, Tooltip } from '@mui/material';
import { Gavel, CheckCircle, Cancel } from '@mui/icons-material';

export default function QuickDisputesWidget({ disputes }: { disputes: any[] }) {
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
                <Tooltip title="Approve Dispute">
                  <IconButton color="success" size="small" sx={{ border: '1px solid', borderColor: 'success.main' }}>
                    <CheckCircle fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject Dispute">
                  <IconButton color="error" size="small" sx={{ border: '1px solid', borderColor: 'error.main' }}>
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
    </Card>
  );
}
