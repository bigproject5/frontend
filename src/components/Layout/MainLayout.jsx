import React from 'react';
import { Box, AppBar, Drawer, Toolbar, Typography } from '@mui/material';

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* 헤더 */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          ml: `${SIDEBAR_WIDTH}px`,
          height: HEADER_HEIGHT,
          backgroundColor: '#002c5f', // 현대차 남색
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}>
            차량 품질 검사 시스템
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 사이드바 */}
      <Drawer
        variant="permanent"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #dee2e6',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            사이드바 영역
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            (추후 네비게이션 메뉴 구현 예정)
          </Typography>
        </Box>
      </Drawer>

      {/* 메인 컨텐츠 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
          p: 3,
          mt: `${HEADER_HEIGHT}px`,
          backgroundColor: '#f8f9fa',
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          overflow: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
