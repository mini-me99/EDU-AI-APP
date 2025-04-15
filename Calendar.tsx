import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, isSameDay } from 'date-fns';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: ''
  });

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    const storedEvents = localStorage.getItem('events');
    
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        setTasks([]);
      }
    }
    
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Error parsing events from localStorage:', error);
        setEvents([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setNewEvent(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title.trim()) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title.trim(),
        date: newEvent.date,
        description: newEvent.description.trim()
      };
      setEvents([...events, event]);
      setNewEvent({ title: '', date: format(new Date(), 'yyyy-MM-dd'), description: '' });
      setOpenDialog(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateTasks = tasks.filter((task: Task) => task.dueDate === selectedDateStr && !task.completed);
  const selectedDateEvents = events.filter((event: Event) => event.date === selectedDateStr);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Calendar
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true, sx: { mb: 3 } } }}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                {format(selectedDate, 'MMMM d, yyyy')}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Add Event
              </Button>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Tasks
            </Typography>
            <List>
              {selectedDateTasks.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No tasks for this date" />
                </ListItem>
              ) : (
                selectedDateTasks.map((task) => (
                  <ListItem key={task.id}>
                    <ListItemText
                      primary={task.title}
                      secondary={`Due: ${format(new Date(task.dueDate), 'MMM dd, yyyy')}`}
                    />
                  </ListItem>
                ))
              )}
            </List>

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Events
            </Typography>
            <List>
              {selectedDateEvents.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No events for this date" />
                </ListItem>
              ) : (
                selectedDateEvents.map((event) => (
                  <ListItem key={event.id}>
                    <ListItemText
                      primary={event.title}
                      secondary={event.description}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleDeleteEvent(event.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddEvent} variant="contained">
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Calendar; 