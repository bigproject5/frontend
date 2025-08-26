import React from 'react';
import { AppBar, Toolbar, Box, Typography, Button, Chip, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../../../public/icons8-현대-480.svg';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role } = useSelector(state => state.auth);

  const isAdmin = () => role === 'ADMIN';
  const userName = decodeURIComponent(user?.name || "");

  const handleLogoClick = () => {
    // 역할에 따라 메인 페이지로 이동
    console.log('로고 클릭됨 - 현재 사용자:', userName);
    console.log('관리자 여부:', isAdmin());

    if (isAdmin()) {
      console.log('관리자 메인으로 이동: /admin/dashboard');
      navigate('/admin/dashboard');
    } else {
      console.log('작업자 메인으로 이동: /worker/main');
      navigate('/worker/main');
    }
  };

  const handleLogout = () => {
    // 로그아웃 기능 구현
    console.log('로그아웃 버튼 클릭됨');
    sessionStorage.removeItem('accessToken'); // 세션 스토리지에서 토큰 삭제
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)',
        boxShadow: '0 4px 20px rgba(0,44,95,0.15)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* 왼쪽: 로고 + 브랜딩 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-1px)'
            }
          }}
          onClick={handleLogoClick}
        >
          <Box
            component="img"
            src={logo}
            alt="H-AVIS Logo"
            sx={{
              height: 48,
              width: 'auto',
              mr: 2,
              filter: 'brightness(1.2) drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              backgroundColor: 'transparent',
              objectFit: 'contain'
            }}
          />
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 800,
              color: 'white',
              fontSize: '24px',
              letterSpacing: '1px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            CHECKAR
          </Typography>
        </Box>

        {/* 오른쪽: 사용자 정보 + 로그아웃 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* 사용자 정보 */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
            borderRadius: 3,
            px: 2.5,
            py: 1.5,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,44,95,0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
              transform: 'translateY(-1px)'
            }
          }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: isAdmin()
                  ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
                  : 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                fontSize: '18px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            >
                {userName.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  fontSize: '15px',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
              >
                  {userName || 'Unknown User'}
              </Typography>
              <Chip
                label={isAdmin() ? '관리자' : '작업자'}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '12px',
                  fontWeight: 700,
                  background: isAdmin()
                    ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
                    : 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                  color: 'white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '& .MuiChip-label': {
                    px: 2
                  }
                }}
              />
            </Box>
          </Box>

          {/* 로그아웃 버튼 */}
          <Button
            variant="outlined"
            size="medium"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 700,
              px: 3,
              py: 1.5,
              borderRadius: 3,
              fontSize: '14px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'white',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,44,95,0.3)'
              }
            }}
          >
            로그아웃
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
