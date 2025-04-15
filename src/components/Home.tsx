import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TaskIcon from '@mui/icons-material/Task';
import TimerIcon from '@mui/icons-material/Timer';
import ChatIcon from '@mui/icons-material/Chat';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Task Management',
      description: 'Organize your study tasks with due dates and priorities. Track your progress and stay on top of your academic goals.',
      icon: <TaskIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/tasks'
    },
    {
      title: 'Study Timer',
      description: 'Track your study sessions with our flexible timer. Use the stopwatch or countdown timer to manage your study time effectively.',
      icon: <TimerIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/stopwatch'
    },
    {
      title: 'AI Assistant',
      description: 'Get instant help with your studies. Our AI assistant can answer questions, explain concepts, and provide study guidance.',
      icon: <ChatIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/ai-chat'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            textAlign: 'center',
            mb: 6
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to EDU AI
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Your all-in-one study companion for academic success
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    transition: 'transform 0.3s ease-in-out',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    {feature.description}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleNavigation(feature.path)}
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          sx={{
            mt: 8,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Start Your Journey Today
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of students who have improved their study habits with EDU AI
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => handleNavigation('/tasks')}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
              }
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 