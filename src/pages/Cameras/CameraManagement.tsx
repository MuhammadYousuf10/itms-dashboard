import { Box, Typography, Chip, TextField, InputAdornment } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import type { Column } from '../../components/common/DataTable';
import TableSkeleton from '../../components/skeletons/TableSkeleton';
import { Search as SearchIcon, CheckCircle as CheckIcon, Error as ErrorIcon, Speed as SpeedIcon, DirectionsCar as CarIcon, Warning as WarningIcon } from '@mui/icons-material';
import { axiosClient } from '../../api/axiosClient';

interface Camera {
  id: string;
  name: string;
  status: 'LIVE' | 'OFFLINE';
  congestion_level: 'LOW' | 'MODERATE' | 'HIGH';
  latitude: number | null;
  longitude: number | null;
}

export default function CameraManagement() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isLoading } = useQuery<{items: Camera[], total: number}>({
    queryKey: ['cameras', page, rowsPerPage, debouncedSearch],
    queryFn: async () => {
      const res = await axiosClient.get('/cameras', {
        params: { skip: page * rowsPerPage, limit: rowsPerPage, search: debouncedSearch || undefined }
      });
      return res.data;
    },
  });

  const columns: Column<Camera>[] = [
    { id: 'id', label: 'Camera ID', minWidth: 100 },
    { id: 'name', label: 'Location Name', minWidth: 150 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      format: (value: unknown) => {
        const status = value as Camera['status'];
        return (
          <Chip 
            icon={status === 'LIVE' ? <CheckIcon fontSize="small" /> : <ErrorIcon fontSize="small" />}
            label={status} 
            color={status === 'LIVE' ? 'success' : 'error'} 
            size="small" 
            sx={{ fontWeight: 700, borderRadius: '8px', px: 0.5, py: 1.5 }} 
          />
        );
      }
    },
    {
      id: 'congestion_level',
      label: 'Congestion Level',
      minWidth: 150,
      format: (value: unknown) => {
        const level = value as Camera['congestion_level'];
        return (
          <Chip 
            icon={
              level === 'LOW' ? <SpeedIcon fontSize="small" /> : 
              level === 'MODERATE' ? <CarIcon fontSize="small" /> : <WarningIcon fontSize="small" />
            }
            label={level + ' TRAFFIC'} 
            color={
              level === 'LOW' ? 'success' : 
              level === 'MODERATE' ? 'warning' : 'error'
            } 
            size="small" 
            variant="outlined"
            sx={{ borderWidth: 2, fontWeight: 700, borderRadius: '8px', px: 0.5, py: 1.5 }}
          />
        );
      }
    },
    {
      id: 'coordinates',
      label: 'GPS Coordinates',
      minWidth: 150,
      format: (_, row: Camera) => {
        return (
          <Typography sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.875rem' }}>
            {row.latitude && row.longitude 
              ? `${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)}` 
              : 'Not Set'}
          </Typography>
        );
      }
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Camera Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and manage all ANPR cameras across the network
          </Typography>
        </Box>
        <TextField
          variant="outlined"
          placeholder="Search by ID, Name..."
          size="small"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            }
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {isLoading ? (
        <TableSkeleton rows={10} columns={5} />
      ) : (
        <DataTable
          columns={columns}
          data={data?.items || []}
          totalCount={data?.total || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      )}
    </Box>
  );
}
