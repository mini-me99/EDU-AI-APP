import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TimerIcon from '@mui/icons-material/Timer';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, isToday, isAfter, parseISO, isValid } from 'date-fns';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        return JSON.parse(storedTasks);
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        return [];
      }
    }
    return [];
  });
  const [studyTime, setStudyTime] = useState<number>(0);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    const storedStudyTime = localStorage.getItem('studyTime');
    
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        setTasks([]);
      }
    }
    
    if (storedStudyTime) {
      try {
        setStudyTime(parseInt(storedStudyTime, 10));
      } catch (error) {
        console.error('Error parsing study time from localStorage:', error);
        setStudyTime(0);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studyTime', studyTime.toString());
  }, [studyTime]);

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const todayTasks = tasks.filter(task => {
    try {
      const taskDate = parseISO(task.dueDate);
      return isValid(taskDate) && format(taskDate, 'yyyy-MM-dd') === todayStr && !task.completed;
    } catch (error) {
      console.error('Invalid date format:', task.dueDate);
      return false;
    }
  });

  const upcomingTasks = tasks.filter(task => {
    try {
      const taskDate = parseISO(task.dueDate);
      return isValid(taskDate) && format(taskDate, 'yyyy-MM-dd') > todayStr && !task.completed;
    } catch (error) {
      console.error('Invalid date format:', task.dueDate);
      return false;
    }
  });

  const completedTasks = tasks.filter(task => task.completed);
  const taskCompletionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleCompleteTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          completed: true,
          completedAt: new Date().toISOString()
        };
      }
      return task;
    }));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Invalid date';
      }
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', dateString);
      return 'Invalid date';
    }
  };

  // Clean up invalid tasks
  useEffect(() => {
    const validTasks = tasks.filter(task => {
      try {
        const date = parseISO(task.createdAt);
        return isValid(date);
      } catch (error) {
        return false;
      }
    });
    
    if (validTasks.length !== tasks.length) {
      setTasks(validTasks);
    }
  }, [tasks]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Edu AI Pro
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Today's Tasks
            </Typography>
            <Typography variant="h4">
              {todayTasks.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task Completion
            </Typography>
            <Typography variant="h4">
              {taskCompletionRate}%
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Study Time
            </Typography>
            <Typography variant="h4">
              {Math.floor(studyTime / 60)}h {studyTime % 60}m
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Deadlines
            </Typography>
            <Typography variant="h4">
              {upcomingTasks.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Today's Tasks
            </Typography>
            <List>
              {todayTasks.length > 0 ? (
                todayTasks.map((task) => (
                  <ListItem key={task.id}>
                    <ListItemText
                      primary={task.title}
                      secondary={`Due: ${formatDate(task.dueDate)}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        onClick={() => handleCompleteTask(task.id)}
                        color="primary"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No tasks for today" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {tasks
                .filter(task => task.completed)
                .sort((a, b) => {
                  const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
                  const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
                  return dateB - dateA;
                })
                .slice(0, 5)
                .map((task) => (
                  <ListItem key={task.id}>
                    <ListItemText
                      primary={task.title}
                      secondary={`Completed on ${formatDate(task.completedAt || task.createdAt)}`}
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 