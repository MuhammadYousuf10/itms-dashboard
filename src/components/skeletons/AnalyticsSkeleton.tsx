import { Box, Card, Grid, Skeleton } from '@mui/material';

export default function AnalyticsSkeleton() {
  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Skeleton animation="wave" width={250} height={40} />
          <Skeleton animation="wave" width={350} height={20} />
        </Box>
        <Skeleton animation="wave" variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
      </Box>

      {/* KPI Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Array.from(new Array(4)).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ p: 3, border: 1, borderColor: 'divider', boxShadow: 'none', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton animation="wave" variant="rounded" width={56} height={56} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton animation="wave" width="60%" height={20} sx={{ mb: 1 }} />
                <Skeleton animation="wave" width="40%" height={32} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, border: 1, borderColor: 'divider', boxShadow: 'none', height: 420, borderRadius: 3 }}>
            <Skeleton animation="wave" width={200} height={32} sx={{ mb: 4 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Skeleton animation="wave" variant="circular" width={280} height={280} />
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, border: 1, borderColor: 'divider', boxShadow: 'none', height: 420, borderRadius: 3 }}>
            <Skeleton animation="wave" width={200} height={32} sx={{ mb: 4 }} />
            <Skeleton animation="wave" variant="rectangular" width="100%" height={280} sx={{ borderRadius: 2 }} />
          </Card>
        </Grid>
      </Grid>

      {/* Area Chart Row */}
      <Card sx={{ p: 3, border: 1, borderColor: 'divider', boxShadow: 'none', height: 400, borderRadius: 3 }}>
        <Skeleton animation="wave" width={250} height={32} sx={{ mb: 4 }} />
        <Skeleton animation="wave" variant="rectangular" width="100%" height={260} sx={{ borderRadius: 2 }} />
      </Card>
    </Box>
  );
}
