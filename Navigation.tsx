import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TimerIcon from '@mui/icons-material/Timer';

interface NavigationProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const drawerWidth = 240;

function Navigation({ activePage, setActivePage }: NavigationProps) {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, page: 'dashboard' },
    { text: 'Tasks', icon: <AssignmentIcon />, page: 'tasks' },
    { text: 'Calendar', icon: <CalendarMonthIcon />, page: 'calendar' },
    { text: 'Stopwatch', icon: <TimerIcon />, page: 'stopwatch' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => setActivePage(item.page)}
              selected={activePage === item.page}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Navigation; 