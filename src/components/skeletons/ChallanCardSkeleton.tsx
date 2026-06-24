import { Box, Card, Skeleton, Grid } from '@mui/material';

export default function ChallanCardSkeleton() {
  return (
    <Card sx={{ 
      p: 3, 
      mb: 3, 
      borderRadius: 4, 
      border: 1, 
      borderColor: 'divider', 
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Skeleton animation="wave" width={180} height={32} sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton animation="wave" width={120} height={20} />
            <Skeleton animation="wave" width={100} height={20} />
          </Box>
        </Box>
        <Skeleton animation="wave" variant="rectangular" width={80} height={32} sx={{ borderRadius: 1.5 }} />
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3 }}>
            <Skeleton animation="wave" width="60%" height={20} sx={{ mb: 1 }} />
            <Skeleton animation="wave" width="80%" height={24} />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3 }}>
            <Skeleton animation="wave" width="60%" height={20} sx={{ mb: 1 }} />
            <Skeleton animation="wave" width="80%" height={24} />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3 }}>
            <Skeleton animation="wave" width="60%" height={20} sx={{ mb: 1 }} />
            <Skeleton animation="wave" width="80%" height={32} />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Skeleton animation="wave" variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
        <Skeleton animation="wave" variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
      </Box>
    </Card>
  );
}
