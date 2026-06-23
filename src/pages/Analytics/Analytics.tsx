import { Box, Typography, Card, Grid, Button } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download as DownloadIcon } from '@mui/icons-material';

const violationData = [
  { name: 'Speeding', value: 450, color: '#EF4444' }, // Error red
  { name: 'Red Light', value: 300, color: '#F59E0B' }, // Warning orange
  { name: 'Wrong Way', value: 150, color: '#10B981' }, // Success green
  { name: 'No Helmet', value: 200, color: '#3B82F6' }, // Primary blue
];

const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 2000 },
  { month: 'Apr', revenue: 2780 },
  { month: 'May', revenue: 1890 },
  { month: 'Jun', revenue: 2390 },
  { month: 'Jul', revenue: 3490 },
];

export default function Analytics() {
  const theme = useTheme();

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('ITMS Traffic Analytics Report', 14, 22);
    
    // Subtitle
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Violations Table
    autoTable(doc, {
      startY: 40,
      head: [['Violation Type', 'Total Count']],
      body: violationData.map(v => [v.name, v.value]),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });

    // Revenue Table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Month', 'Revenue Collected ($)']],
      body: revenueData.map(r => [r.month, r.revenue]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save('itms-analytics-report.pdf');
  };

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Analytics & Reporting
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Deep dive into violation statistics and revenue collection
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<DownloadIcon />}
          onClick={handleDownloadPDF}
          sx={{ boxShadow: 'none' }}
        >
          Export PDF
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, border: 1, borderColor: 'divider', boxShadow: 'none', height: 420, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Violations Breakdown</Typography>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={violationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={8}
                >
                  {violationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                    borderRadius: 8,
                    color: theme.palette.text.primary
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, border: 1, borderColor: 'divider', boxShadow: 'none', height: 420, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Revenue Collection</Typography>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={revenueData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                barSize={32}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.9} />
                    <stop offset="95%" stopColor={theme.palette.primary.light} stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="month" 
                  stroke={theme.palette.text.secondary} 
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke={theme.palette.text.secondary} 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <RechartsTooltip 
                  cursor={{ fill: theme.palette.action.hover, radius: 8 }}
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    color: theme.palette.text.primary,
                    fontWeight: 600
                  }}
                  itemStyle={{ color: theme.palette.text.primary }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="url(#colorRevenue)" 
                  radius={[8, 8, 8, 8]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
