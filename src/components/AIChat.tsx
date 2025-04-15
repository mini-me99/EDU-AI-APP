import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { motion, AnimatePresence } from 'framer-motion';
import OpenAI from 'openai';
import { format } from 'date-fns';

// Add type declarations for Chatbase
declare global {
  interface Window {
    chatbase: {
      (command: string, ...args: any[]): void;
      q?: any[];
      getState: () => string;
    };
  }
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

// Initialize OpenAI client with direct API key
const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

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

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    // Initialize Chatbase widget
    if (!window.chatbase || window.chatbase.getState() !== "initialized") {
      window.chatbase = ((command: string, ...args: any[]) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push([command, ...args]);
      }) as any;
      
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop: string) {
          if (prop === "q") {
            return target.q;
          }
          return (...args: any[]) => target(prop, ...args);
        }
      }) as any;

      const onLoad = () => {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "N-o0DfBuKb50DkKlFzGLv";
        (script as any).domain = "www.chatbase.co";
        document.body.appendChild(script);
      };

      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
      }
    }
  }, []);

  const handleSendMessage = () => {
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

    // Send message to Chatbase
    if (window.chatbase) {
      window.chatbase("sendMessage", {
        message: input.trim(),
        onResponse: (response: any) => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: response.text,
            sender: 'ai',
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsLoading(false);
        },
        onError: (error: any) => {
          console.error('Chatbase error:', error);
          setError('Failed to get AI response. Please try again.');
          setIsLoading(false);
        }
      });
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
                    secondary={new Date(message.timestamp).toLocaleTimeString()}
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