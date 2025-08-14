import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Build as BuildIcon
} from '@mui/icons-material';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useSelector(state => state.auth);

  const isAdmin = () => role === 'ADMIN';

  const devMenuItems = [
    {
      text: '대시보드',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
      description: '메인페이지'
    },
    {
      text: '작업자 관리',
      icon: <PeopleIcon />,
      path: '/admin/workers',
      description: '작업자 목록'
    },
    {
      text: '공지사항',
      icon: <NotificationsIcon />,
      path: '/admin/notices',
      description: '공지 목록'
    },
    {
      text: '작업자 메인',
      icon: <HomeIcon />,
      path: '/worker/main',
      description: '메인페이지'
    },
    {
      text: '마이페이지',
      icon: <PersonIcon />,
      path: '/worker/profile',
      description: '내 정보'
    },
    {
      text: '공지사항',
      icon: <NotificationsIcon />,
      path: '/notices',
      description: '공지 목록'
    },
    {
      text: '수동 테스트',
      icon: <BuildIcon />,
      path: '/worker/manual-test',
      description: '수동 테스트 생성'
    }
  ];


  // 관리자 메뉴
  const adminMenuItems = [
    {
      text: '대시보드',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
      description: '메인페이지'
    },
    {
      text: '작업자 관리',
      icon: <PeopleIcon />,
      path: '/admin/workers',
      description: '작업자 목록'
    },
    {
      text: '공지사항',
      icon: <NotificationsIcon />,
      path: '/admin/notices',
      description: '공지 목록'
    }
  ];

  // 작업자 메뉴
  const workerMenuItems = [
    {
      text: '작업자 메인',
      icon: <HomeIcon />,
      path: '/worker/main',
      description: '메인페이지'
    },
    {
      text: '마이페이지',
      icon: <PersonIcon />,
      path: '/worker/profile',
      description: '내 정보'
    },
    {
      text: '공지사항',
      icon: <NotificationsIcon />,
      path: '/notices',
      description: '공지 목록'
    },
    {
      text: '수동 테스트',
      icon: <BuildIcon />,
      path: '/worker/manual-test',
      description: '수동 테스트 생성'
    }
  ];

  let menuItems;
  if(role === "DEV") menuItems = devMenuItems;
  else menuItems = isAdmin() ? adminMenuItems : workerMenuItems;

  const handleMenuClick = (path, disabled) => {
    if (!disabled) {
      navigate(path);
    }
  };

  const isActive = (path) => {
    if (path === '/admin' || path === '/worker') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        width: '360px',
        height: 'calc(100vh - 64px)',
        position: 'fixed',
        top: '64px', // Header height
        left: 0,
        background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRight: '1px solid #dee2e6',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'inset -1px 0 0 rgba(0,44,95,0.1)',
        zIndex: 1000
      }}
    >
      {/* 메뉴 리스트 - 상단 여백 추가 */}
      <Box sx={{ flex: 1, py: 3, pt: 4 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{ mb: 1 }}
            >
              <ListItemButton
                onClick={() => handleMenuClick(item.path, item.disabled)}
                disabled={item.disabled}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.3s ease',
                  background: isActive(item.path)
                    ? 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)'
                    : 'transparent',
                  color: isActive(item.path) ? 'white' : '#495057',
                  '&:hover': {
                    background: isActive(item.path)
                      ? 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)'
                      : 'linear-gradient(135deg, rgba(0,44,95,0.08) 0%, rgba(25,118,210,0.08) 100%)',
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 12px rgba(0,44,95,0.15)'
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(0,0,0,0.04)',
                    color: '#adb5bd'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path)
                      ? 'white'
                      : item.disabled
                        ? '#adb5bd'
                        : '#002c5f',
                    minWidth: 40,
                    transition: 'color 0.3s ease'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: isActive(item.path) ? 700 : 600,
                        fontSize: '15px'
                      }}
                    >
                      {item.text}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        color: isActive(item.path)
                          ? 'rgba(255,255,255,0.8)'
                          : item.disabled
                            ? '#adb5bd'
                            : '#6c757d',
                        fontSize: '12px'
                      }}
                    >
                      {item.description}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* 사이드바 푸터 */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #dee2e6',
          background: 'rgba(0,44,95,0.02)'
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: '#6c757d',
            textAlign: 'center',
            display: 'block',
            fontWeight: 500
          }}
        >
          H-AVIS v1.0
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
