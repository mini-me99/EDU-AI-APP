import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TimerIcon from '@mui/icons-material/Timer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface StudySession {
  id: string;
  text: string;
  startTime: number;
  endTime: number | null;
  duration: number;
}

interface ExamLink {
  id: string;
  title: string;
  url: string;
  description: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

function Stopwatch() {
  const [activeTab, setActiveTab] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [newText, setNewText] = useState('');
  const [examLinks, setExamLinks] = useState<ExamLink[]>([]);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: ''
  });
  const [countdownMinutes, setCountdownMinutes] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [countdownActive, setCountdownActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load exam links from localStorage
  useEffect(() => {
    const storedLinks = localStorage.getItem('examLinks');
    if (storedLinks) {
      try {
        setExamLinks(JSON.parse(storedLinks));
      } catch (error) {
        console.error('Error parsing exam links:', error);
      }
    }
  }, []);

  // Save exam links to localStorage
  useEffect(() => {
    localStorage.setItem('examLinks', JSON.stringify(examLinks));
  }, [examLinks]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (countdownActive && (countdownMinutes > 0 || countdownSeconds > 0)) {
      interval = setInterval(() => {
        if (countdownSeconds > 0) {
          setCountdownSeconds((prev) => prev - 1);
        } else if (countdownMinutes > 0) {
          setCountdownMinutes((prev) => prev - 1);
          setCountdownSeconds(59);
        } else {
          setCountdownActive(false);
          alert('Countdown finished!');
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdownActive, countdownMinutes, countdownSeconds]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (activeTab === 0) {
      if (!isActive && !currentSession) {
        // Start new session
        const session: StudySession = {
          id: Date.now().toString(),
          text: newText,
          startTime: Date.now(),
          endTime: null,
          duration: 0
        };
        setCurrentSession(session);
        setNewText('');
        setTime(0); // Reset timer when starting new session
      } else if (isActive && currentSession) {
        // End current session
        const endTime = Date.now();
        const duration = Math.floor((endTime - currentSession.startTime) / 1000);
        const updatedSession = {
          ...currentSession,
          endTime,
          duration
        };
        setCurrentSession(null);
        
        // Update study time in localStorage
        const studyTime = localStorage.getItem('studyTime');
        const totalStudyTime = studyTime ? parseInt(studyTime) + time : time;
        localStorage.setItem('studyTime', totalStudyTime.toString());
      }
      setIsActive(!isActive);
    } else {
      setCountdownActive(!countdownActive);
    }
  };

  const handleReset = () => {
    if (activeTab === 0) {
      if (isActive && currentSession) {
        // Save current session time before resetting
        const endTime = Date.now();
        const duration = Math.floor((endTime - currentSession.startTime) / 1000);
        const studyTime = localStorage.getItem('studyTime');
        const totalStudyTime = studyTime ? parseInt(studyTime) + time : time;
        localStorage.setItem('studyTime', totalStudyTime.toString());
      }
      setTime(0);
      setIsActive(false);
      setCurrentSession(null);
    } else {
      setCountdownMinutes(0);
      setCountdownSeconds(0);
      setCountdownActive(false);
    }
  };

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      const link: ExamLink = {
        id: Date.now().toString(),
        title: newLink.title,
        url: newLink.url,
        description: newLink.description
      };
      setExamLinks([...examLinks, link]);
      setNewLink({ title: '', url: '', description: '' });
    }
  };

  const handleDeleteLink = (id: string) => {
    setExamLinks(examLinks.filter(link => link.id !== id));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual AI API call)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'm an AI assistant. You asked: "${userMessage.text}". I can help you with your studies, answer questions, and provide guidance.`,
        sender: 'ai',
        timestamp: Date.now()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stopwatch
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Stopwatch" />
          <Tab label="Countdown" />
        </Tabs>

        {activeTab === 0 ? (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h2" align="center" gutterBottom>
              {formatTime(time)}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={isActive ? <PauseIcon /> : <PlayArrowIcon />}
                onClick={handleStartStop}
              >
                {isActive ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="contained"
                startIcon={<StopIcon />}
                onClick={handleReset}
                disabled={!isActive && time === 0}
              >
                Reset
              </Button>
            </Box>
            {!isActive && !currentSession && (
              <TextField
                fullWidth
                label="What are you studying?"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
            {currentSession && (
              <Typography variant="body1" align="center">
                Current Session: {currentSession.text}
              </Typography>
            )}
          </Box>
        ) : (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h2" align="center" gutterBottom>
              {`${countdownMinutes.toString().padStart(2, '0')}:${countdownSeconds.toString().padStart(2, '0')}`}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <TextField
                type="number"
                label="Minutes"
                value={countdownMinutes}
                onChange={(e) => setCountdownMinutes(parseInt(e.target.value) || 0)}
                disabled={countdownActive}
                sx={{ width: 100 }}
              />
              <TextField
                type="number"
                label="Seconds"
                value={countdownSeconds}
                onChange={(e) => setCountdownSeconds(parseInt(e.target.value) || 0)}
                disabled={countdownActive}
                sx={{ width: 100 }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={countdownActive ? <PauseIcon /> : <PlayArrowIcon />}
                onClick={handleStartStop}
                disabled={countdownMinutes === 0 && countdownSeconds === 0}
              >
                {countdownActive ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="contained"
                startIcon={<StopIcon />}
                onClick={handleReset}
                disabled={!countdownActive && countdownMinutes === 0 && countdownSeconds === 0}
              >
                Reset
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Add Exam Link
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Title"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="URL"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                />
                <Button
                  variant="contained"
                  onClick={handleAddLink}
                  disabled={!newLink.title || !newLink.url}
                >
                  Add Link
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Exam Links
              </Typography>
              <List>
                <AnimatePresence>
                  {examLinks.length > 0 ? (
                    examLinks.map((link) => (
                      <motion.div
                        key={link.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ListItem>
                          <ListItemText
                            primary={link.title}
                            secondary={
                              <>
                                <Typography variant="body2" color="text.secondary">
                                  {link.description}
                                </Typography>
                                <Typography variant="body2" color="primary">
                                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    {link.url}
                                  </a>
                                </Typography>
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleDeleteLink(link.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </motion.div>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No exam links added" />
                    </ListItem>
                  )}
                </AnimatePresence>
              </List>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Stopwatch; 