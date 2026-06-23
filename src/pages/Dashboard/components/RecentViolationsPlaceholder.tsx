import { Card, Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { DirectionsCar as CarIcon } from '@mui/icons-material';

const recentViolations = [
  { id: 'V-892', plate: 'ABC 1234', speed: '85 km/h', limit: '60', time: '2 mins ago', color: 'error.main' },
  { id: 'V-891', plate: 'XYZ 9876', speed: '72 km/h', limit: '60', time: '14 mins ago', color: 'warning.main' },
  { id: 'V-890', plate: 'LMN 4567', speed: '91 km/h', limit: '60', time: '28 mins ago', color: 'error.main' },
  { id: 'V-889', plate: 'PQR 3456', speed: '68 km/h', limit: '60', time: '45 mins ago', color: 'warning.main' },
];

export default function RecentViolationsPlaceholder() {
  return (
    <Card 
      sx={{ 
        height: 420, 
        display: 'flex', 
        flexDirection: 'column',
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 0.5 }}>
            Recent Violations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Latest recorded speeding events
          </Typography>
        </Box>
        <Typography variant="button" color="primary.main" sx={{ cursor: 'pointer', fontWeight: 600 }}>
          View All
        </Typography>
      </Box>
      <List sx={{ width: '100%', flexGrow: 1, overflow: 'auto', p: 0 }}>
        {recentViolations.map((violation, index) => (
          <ListItem 
            key={violation.id} 
            alignItems="flex-start"
            sx={{ 
              px: 0,
              py: 2,
              borderBottom: index < recentViolations.length - 1 ? 1 : 0,
              borderColor: 'divider'
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: `${violation.color}15`, color: violation.color }}>
                <CarIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                    {violation.plate}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {violation.time}
                  </Typography>
                </Box>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    sx={{ display: 'inline', fontWeight: 600 }}
                    component="span"
                    variant="body2"
                    color={violation.color}
                  >
                    {violation.speed}
                  </Typography>
                  <Typography component="span" variant="body2" color="text.secondary">
                    {' / Limit: ' + violation.limit + ' km/h'}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
