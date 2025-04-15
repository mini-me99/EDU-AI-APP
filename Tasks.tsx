import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Paper,
  Checkbox,
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format, isToday, isAfter, isBefore, startOfDay, parseISO, isValid, isSameDay, addHours } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  createdAt: string;
}

function Tasks() {
  // Initialize tasks from localStorage
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

  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: new Date(),
    startTime: new Date(),
    endTime: new Date(),
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    // Create a new task with proper date formatting
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      dueDate: format(newTask.dueDate, 'yyyy-MM-dd'),
      startTime: format(newTask.startTime, 'HH:mm'),
      endTime: format(newTask.endTime, 'HH:mm'),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Add the task to the list
    setTasks(prevTasks => [...prevTasks, task]);

    // Reset the form
    setNewTask({
      title: '',
      dueDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
    });
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
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

  const isTaskDueToday = (task: Task) => {
    try {
      const taskDate = parseISO(task.dueDate);
      const now = new Date();
      
      // Only show tasks that are explicitly set for today
      return isSameDay(taskDate, now);
    } catch (error) {
      console.error('Error checking if task is due today:', error);
      return false;
    }
  };

  const isTaskUpcoming = (task: Task) => {
    try {
      const taskDate = parseISO(task.dueDate);
      const now = new Date();
      
      // Show tasks that are set for future dates
      return isAfter(taskDate, now) && !isSameDay(taskDate, now);
    } catch (error) {
      console.error('Error checking if task is upcoming:', error);
      return false;
    }
  };

  // Filter tasks based on their due dates
  const todayTasks = tasks.filter(task => 
    !task.completed && 
    isTaskDueToday(task)
  );

  const upcomingTasks = tasks.filter(task => 
    !task.completed && 
    isTaskUpcoming(task)
  );

  const completedTasks = tasks.filter(task => task.completed);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTask();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={newTask.dueDate}
                onChange={(date) => date && setNewTask({ ...newTask, dueDate: date })}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Start Time"
                value={newTask.startTime}
                onChange={(time) => time && setNewTask({ ...newTask, startTime: time })}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="End Time"
                value={newTask.endTime}
                onChange={(time) => time && setNewTask({ ...newTask, endTime: time })}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddTask}
              disabled={!newTask.title.trim()}
            >
              Add Task
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Today's Tasks
            </Typography>
            <List>
              <AnimatePresence>
                {todayTasks.length > 0 ? (
                  todayTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItem>
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Chip
                                size="small"
                                label={`${task.startTime} - ${task.endTime}`}
                                icon={<AccessTimeIcon />}
                              />
                              <Chip
                                size="small"
                                label={formatDate(task.dueDate)}
                                color="primary"
                              />
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleToggleTask(task.id)}
                            color={task.completed ? 'success' : 'default'}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </motion.div>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No tasks for today" />
                  </ListItem>
                )}
              </AnimatePresence>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Tasks
            </Typography>
            <List>
              <AnimatePresence>
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItem>
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Chip
                                size="small"
                                label={`${task.startTime} - ${task.endTime}`}
                                icon={<AccessTimeIcon />}
                              />
                              <Chip
                                size="small"
                                label={formatDate(task.dueDate)}
                                color="primary"
                              />
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleToggleTask(task.id)}
                            color={task.completed ? 'success' : 'default'}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </motion.div>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No upcoming tasks" />
                  </ListItem>
                )}
              </AnimatePresence>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Tasks; 