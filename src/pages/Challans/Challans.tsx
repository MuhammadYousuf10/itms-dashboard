import { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import DataTable from '../../components/common/DataTable';
import type { Column } from '../../components/common/DataTable';

interface ChallanRow {
  id: string;
  plate: string;
  violationType: string;
  speed: string;
  fineAmount: number;
  status: 'Pending' | 'Paid';
  date: string;
}

const columns: Column<ChallanRow>[] = [
  { id: 'id', label: 'Challan ID', minWidth: 100 },
  { id: 'plate', label: 'Vehicle Plate', minWidth: 120 },
  { id: 'violationType', label: 'Violation Type', minWidth: 150 },
  { id: 'speed', label: 'Recorded Speed', minWidth: 120 },
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
        color={value === 'Paid' ? 'success' : 'warning'}
        sx={{ fontWeight: 600, borderRadius: 1 }}
      />
    ),
  },
];

const mockData: ChallanRow[] = [
  { id: 'CH-1045', plate: 'ABC-1234', violationType: 'Speeding', speed: '85 km/h', fineAmount: 150, status: 'Pending', date: '2026-06-23' },
  { id: 'CH-1044', plate: 'XYZ-9876', violationType: 'Red Light', speed: '-', fineAmount: 200, status: 'Paid', date: '2026-06-22' },
  { id: 'CH-1043', plate: 'LMN-4567', violationType: 'Speeding', speed: '92 km/h', fineAmount: 250, status: 'Pending', date: '2026-06-22' },
  { id: 'CH-1042', plate: 'PQR-3456', violationType: 'No Helmet', speed: '-', fineAmount: 50, status: 'Paid', date: '2026-06-21' },
  { id: 'CH-1041', plate: 'DEF-5678', violationType: 'Speeding', speed: '78 km/h', fineAmount: 100, status: 'Pending', date: '2026-06-21' },
  { id: 'CH-1040', plate: 'GHI-9012', violationType: 'Wrong Way', speed: '-', fineAmount: 300, status: 'Pending', date: '2026-06-20' },
  { id: 'CH-1039', plate: 'JKL-3456', violationType: 'Speeding', speed: '105 km/h', fineAmount: 350, status: 'Paid', date: '2026-06-20' },
];

export default function Challans() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

      <DataTable 
        columns={columns} 
        data={mockData}
        totalCount={mockData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
