import { Box } from '@mui/material';
import Sidebar from '../Sidebar';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: 'background.default',
          minHeight: '100vh',
          width: 'calc(100% - 240px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 