import { Box, Card, Grid, Skeleton } from '@mui/material';

export default function LiveFeedSkeleton({ count = 4 }: { count?: number }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {Array.from(new Array(count)).map((_, i) => (
          <Grid key={i} size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 2, borderRadius: 4, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Skeleton animation="wave" width={120} height={28} />
                <Skeleton animation="wave" width={60} height={28} />
              </Box>
              <Skeleton animation="wave" variant="rectangular" width="100%" height={240} sx={{ borderRadius: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Skeleton animation="wave" width={150} height={20} />
                <Skeleton animation="wave" width={80} height={20} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
