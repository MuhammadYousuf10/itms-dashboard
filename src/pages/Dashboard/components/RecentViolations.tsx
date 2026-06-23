import { Card, Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { DirectionsCar as CarIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Violation {
  id: string;
  plate: string;
  speed: string;
  limit: string;
  time: string;
  color: string;
}

interface RecentViolationsProps {
  violations: Violation[];
}

export default function RecentViolations({ violations }: RecentViolationsProps) {
  const navigate = useNavigate();

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
        <Typography 
          variant="button" 
          color="primary.main" 
          sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
          onClick={() => navigate('/challans')}
        >
          View All
        </Typography>
      </Box>
      <List sx={{ width: '100%', flexGrow: 1, overflow: 'auto', p: 0 }}>
        {violations.map((violation, index) => (
          <ListItem 
            key={violation.id} 
            alignItems="flex-start"
            sx={{ 
              px: 0,
              py: 2,
              borderBottom: index < violations.length - 1 ? 1 : 0,
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
        {violations.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="text.secondary">No recent violations.</Typography>
          </Box>
        )}
      </List>
    </Card>
  );
}
