import { useState, useEffect } from 'react';
import { Box, Typography, Chip, CircularProgress, Alert } from '@mui/material';
import DataTable from '../../components/common/DataTable';
import type { Column } from '../../components/common/DataTable';
import { axiosClient } from '../../api/axiosClient';

interface ChallanRow {
  id: string;
  plate: string;
  violationType: string;
  cameraId: string;
  fineAmount: number;
  status: 'PENDING' | 'PAID';
  date: string;
}

const columns: Column<ChallanRow>[] = [
  { id: 'id', label: 'Challan ID', minWidth: 100 },
  { id: 'plate', label: 'Vehicle Plate', minWidth: 120 },
  { id: 'violationType', label: 'Violation Type', minWidth: 150 },
  { id: 'cameraId', label: 'Camera Node', minWidth: 120 },
  { 
    id: 'fineAmount', 
    label: 'Fine Amount', 
    minWidth: 120,
    format: (value) => `$${value}`
  },
  { id: 'date', label: 'Date Issued', minWidth: 150 },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    format: (value) => (
      <Chip 
        label={value as string} 
        size="small"
        color={value === 'PAID' ? 'success' : 'warning'}
        sx={{ fontWeight: 600, borderRadius: 1 }}
      />
    ),
  },
];

export default function Challans() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<ChallanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChallans = async () => {
      try {
        const response = await axiosClient.get('/challans');
        // Map backend Pydantic schema to frontend Row interface
        const mappedData: ChallanRow[] = response.data.map((item: any) => ({
          id: item.id,
          plate: item.vehicle_plate,
          violationType: item.violation_type,
          cameraId: item.camera_id,
          fineAmount: item.fine_amount,
          status: item.status,
          date: new Date(item.date_issued).toLocaleDateString(),
        }));
        setData(mappedData);
      } catch (err: any) {
        console.error("Failed to fetch challans:", err);
        setError('Failed to load challans from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchChallans();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Challans Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage all issued traffic violation tickets
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable 
          columns={columns} 
          data={data}
          totalCount={data.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Box>
  );
}
