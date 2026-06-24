import { Box, Typography, Card, Grid, Button } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTheme, alpha } from '@mui/material/styles';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download as DownloadIcon, ReceiptLong, LocalPolice, TrendingUp, Videocam } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../api/axiosClient';
import AnalyticsSkeleton from '../../components/skeletons/AnalyticsSkeleton';

export default function Analytics() {
  const theme = useTheme();

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics_dashboard'],
    queryFn: async () => {
      const res = await axiosClient.get('/analytics/dashboard');
      return res.data;
    }
  });

  const handleDownloadPDF = () => {
    if (!analyticsData) return;
    
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('ITMS Traffic Analytics Report', 14, 22);
    
    // Subtitle
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // KPI Summary
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Revenue: $${analyticsData.kpis.totalRevenue}`, 14, 40);
    doc.text(`Total Violations: ${analyticsData.kpis.totalViolations}`, 14, 46);
    doc.text(`Collection Rate: ${analyticsData.kpis.collectionRate}%`, 14, 52);
    doc.text(`Active Cameras: ${analyticsData.kpis.activeCameras}`, 14, 58);
    
    // Violations Table
    autoTable(doc, {
      startY: 65,
      head: [['Violation Type', 'Total Count']],
      body: analyticsData.violationData.map((v: any) => [v.name, v.value]),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });

    // Revenue Table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Month', 'Revenue Collected ($)']],
      body: analyticsData.revenueData.map((r: any) => [r.month, r.revenue]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save('itms-analytics-report.pdf');
  };

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

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

      {/* KPI Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Total Revenue', value: `$${analyticsData.kpis.totalRevenue.toLocaleString()}`, icon: <TrendingUp />, color: 'primary.main', bg: alpha(theme.palette.primary.main, 0.1) },
          { title: 'Total Violations', value: analyticsData.kpis.totalViolations.toLocaleString(), icon: <ReceiptLong />, color: 'error.main', bg: alpha(theme.palette.error.main, 0.1) },
          { title: 'Collection Rate', value: `${analyticsData.kpis.collectionRate}%`, icon: <LocalPolice />, color: 'success.main', bg: alpha(theme.palette.success.main, 0.1) },
          { title: 'Active Cameras', value: analyticsData.kpis.activeCameras, icon: <Videocam />, color: 'warning.main', bg: alpha(theme.palette.warning.main, 0.1) },
        ].map((kpi, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ p: 3, border: 1, borderColor: 'divider', boxShadow: 'none', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: kpi.bg, color: kpi.color, display: 'flex' }}>
                {kpi.icon}
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>{kpi.title}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{kpi.value}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, border: 1, borderColor: 'divider', boxShadow: 'none', height: 420, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Violations Breakdown</Typography>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={analyticsData?.violationData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={8}
                >
                  {(analyticsData?.violationData || []).map((entry: any, index: number) => (
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
                data={analyticsData?.revenueData || []}
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
        
        {/* Hourly Traffic Area Chart */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3, border: 1, borderColor: 'divider', boxShadow: 'none', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Hourly Traffic vs Violations</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData?.hourlyData || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.info.main} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.palette.info.main} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                <XAxis dataKey="time" stroke={theme.palette.text.secondary} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke={theme.palette.text.secondary} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider, borderRadius: 12 }}
                  itemStyle={{ color: theme.palette.text.primary }}
                />
                <Area type="monotone" dataKey="volume" stroke={theme.palette.info.main} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
