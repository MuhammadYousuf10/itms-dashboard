import { Box, Card, Grid, Skeleton } from '@mui/material';

export default function DashboardSkeleton() {
  return (
    <Box sx={{ flexGrow: 1, mt: 2 }}>
      {/* 4 Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {Array.from(new Array(4)).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'none', border: 1, borderColor: 'divider' }}>
              <Box>
                <Skeleton animation="wave" width={100} height={20} sx={{ mb: 1 }} />
                <Skeleton animation="wave" width={140} height={40} />
                <Skeleton animation="wave" width={80} height={20} sx={{ mt: 1 }} />
              </Box>
              <Skeleton animation="wave" variant="circular" width={60} height={60} />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Chart Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 3, borderRadius: 4, height: 400, boxShadow: 'none', border: 1, borderColor: 'divider' }}>
            <Skeleton animation="wave" width={200} height={32} sx={{ mb: 3 }} />
            <Skeleton animation="wave" variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 3, borderRadius: 4, height: 400, boxShadow: 'none', border: 1, borderColor: 'divider' }}>
            <Skeleton animation="wave" width={150} height={32} sx={{ mb: 3 }} />
            {Array.from(new Array(5)).map((_, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton animation="wave" variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton animation="wave" width="80%" height={20} />
                  <Skeleton animation="wave" width="40%" height={16} />
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>

      {/* Live Feed Row */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 3, borderRadius: 4, height: 350, boxShadow: 'none', border: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Skeleton animation="wave" width={180} height={32} />
              <Skeleton animation="wave" width={60} height={24} />
            </Box>
            <Grid container spacing={2}>
              {Array.from(new Array(2)).map((_, i) => (
                <Grid key={i} size={{ xs: 6 }}>
                  <Skeleton animation="wave" variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 3, borderRadius: 4, height: 350, boxShadow: 'none', border: 1, borderColor: 'divider' }}>
            <Skeleton animation="wave" width={180} height={32} sx={{ mb: 3 }} />
            {Array.from(new Array(3)).map((_, i) => (
              <Skeleton animation="wave" variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} key={i} />
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
