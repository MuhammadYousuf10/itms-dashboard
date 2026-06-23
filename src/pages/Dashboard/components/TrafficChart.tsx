import { Card, Box, Typography } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

interface TrafficChartProps {
  data: { time: string; volume: number }[];
}

export default function TrafficChart({ data }: TrafficChartProps) {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: 420, 
        display: 'flex', 
        flexDirection: 'column',
        p: 3,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: 'text.primary', mb: 0.5 }}>
          Traffic Volume Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Number of vehicles detected throughout the day
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
            <XAxis dataKey="time" stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
                borderRadius: 8,
                color: theme.palette.text.primary
              }} 
            />
            <Area type="monotone" dataKey="volume" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}
