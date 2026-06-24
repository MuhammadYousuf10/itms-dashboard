import { Box, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none', border: 1, borderColor: 'divider' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {Array.from(new Array(columns)).map((_, index) => (
                <TableCell key={index}>
                  <Skeleton animation="wave" width="60%" height={24} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(new Array(rows)).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from(new Array(columns)).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    {colIndex === columns - 1 ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Skeleton animation="wave" variant="circular" width={32} height={32} />
                        <Skeleton animation="wave" variant="circular" width={32} height={32} />
                      </Box>
                    ) : colIndex === 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Skeleton animation="wave" variant="circular" width={40} height={40} />
                        <Box>
                          <Skeleton animation="wave" width={100} height={20} />
                          <Skeleton animation="wave" width={60} height={16} />
                        </Box>
                      </Box>
                    ) : (
                      <Skeleton animation="wave" width="80%" height={24} />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderTop: 1, borderColor: 'divider' }}>
        <Skeleton animation="wave" width={250} height={32} />
      </Box>
    </Paper>
  );
}
