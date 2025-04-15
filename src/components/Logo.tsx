import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const Logo = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="EDU AI Logo"
        sx={{
          width: 48,
          height: 48,
          objectFit: 'contain',
        }}
      />
      <Typography
        variant="h6"
        component="span"
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        EDU AI
      </Typography>
    </Box>
  );
};

export default Logo; 