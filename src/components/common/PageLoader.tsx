import { Box, Skeleton } from '@mui/material';

export default function PageLoader() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1400, mx: 'auto' }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Skeleton variant="text" width={250} height={50} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={400} height={20} />
        </Box>
        <Skeleton variant="rounded" width={120} height={40} />
      </Box>

      {/* Grid/Table Body Skeleton */}
      <Box sx={{ width: '100%', mt: 4 }}>
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <Skeleton variant="rounded" sx={{ flexGrow: 1, height: 60 }} />
          <Skeleton variant="rounded" sx={{ flexGrow: 1, height: 60 }} />
          <Skeleton variant="rounded" sx={{ flexGrow: 1, height: 60 }} />
          <Skeleton variant="rounded" sx={{ flexGrow: 1, height: 60 }} />
        </Box>
        
        {/* Table Rows */}
        {[...Array(6)].map((_, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
            <Skeleton variant="rounded" sx={{ flexGrow: 1, height: 50 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
