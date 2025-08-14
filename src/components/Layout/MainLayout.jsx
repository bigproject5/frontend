import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import PrivacyPolicyBar from './PrivacyPolicyBar';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <Box 
          component="main" 
          sx={{ 
            flex: 1, 
            p: 3, 
            bgcolor: '#fafafa', 
            ml: '360px', 
            overflowY: 'auto',
            minHeight: 'calc(100vh - 64px)' // 64px is header height
          }}
        >
          <Outlet />
          <PrivacyPolicyBar />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;

