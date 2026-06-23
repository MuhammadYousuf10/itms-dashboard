import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ViolationTypeChart({ data }: { data: any[] }) {
  const theme = useTheme();

  const COLORS = [
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.primary.main,
    theme.palette.success.main,
  ];

  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper', backgroundImage: 'none', border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Violations Breakdown</Typography>
        <Box sx={{ flexGrow: 1, minHeight: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data?.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 8, 
                  border: 'none',
                  backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
