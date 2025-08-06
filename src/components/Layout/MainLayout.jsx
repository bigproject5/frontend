import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 헤더 영역 - Header 컴포넌트 사용 */}
      <Header />

      {/* 사이드바와 메인 컨텐츠 영역 */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* 사이드바 영역 - Sidebar 컴포넌트 사용 */}
        <Sidebar />

        {/* 페이지 컨텐츠 */}
        <Box component="main" sx={{ flex: 1, p: 3, bgcolor: '#fafafa' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
