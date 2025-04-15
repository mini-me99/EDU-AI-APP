import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

function AIChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      try {
        return JSON.parse(storedMessages);
      } catch (error) {
        console.error('Error parsing chat messages:', error);
        return [];
      }
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://www.chatbase.co/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_CHATBASE_API_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: "user", content: input.trim() }
          ],
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Chatbase');
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message || 'Sorry, I could not process your request.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error getting AI response:', err);
      setError('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        AI Chat Assistant
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ 
        p: 2, 
        mb: 2, 
        flexGrow: 1, 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ListItem
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  p: 1
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: 2
                  }}
                >
                  <ListItemText
                    primary={message.text}
                    secondary={format(new Date(message.timestamp), 'HH:mm')}
                    secondaryTypographyProps={{
                      color: message.sender === 'user' ? 'white' : 'text.secondary',
                      fontSize: '0.75rem'
                    }}
                  />
                </Paper>
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default AIChat; 