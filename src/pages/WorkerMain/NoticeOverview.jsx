import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  KeyboardArrowRight as ArrowRightIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // useNavigate import 추가
import { getNotices } from '../../api/workerMainApi.js';

const NoticeOverview = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 공지사항 목록 조회
  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);

      // 최신 5개 공지사항 조회
      const response = await getNotices({ page: 0, size: 5 });

      if (response.status === 'success' && response.data?.content) {
        setNotices(response.data.content);
      } else {
        setNotices([]);
      }
    } catch (err) {
      console.error('공지사항 조회 실패:', err);
      setError('공지사항을 불러오는데 실패했습니다.');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 공지사항 조회
  useEffect(() => {
    fetchNotices();
  }, []);

  // 날짜 포맷팅 함수 - API 응답 구조에 맞게 수정
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '날짜 없음';
      }
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '날짜 오류';
    }
  };

  // 더보기 클릭 핸들러 (나중에 라우팅 연결 예정)
  const handleViewMore = () => {
    try {
      console.log('전체 공지사항 목록으로 이동');
      navigate('/notices'); // App.jsx의 라우팅에 맞게 /notices로 수정
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        mb: 2
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* 헤더 */}
        <Box sx={{
          p: 3,
          background: 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <NotificationsIcon sx={{ fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                최근 공지사항
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={handleViewMore}
              sx={{
                color: 'white',
                fontSize: '12px',
                fontWeight: 500,
                textTransform: 'none',
                padding: '4px 8px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
              endIcon={<ArrowRightIcon sx={{ fontSize: 14 }} />}
            >
              더보기
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && notices.length === 0 && (
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                py: 3,
                color: '#6c757d'
              }}
            >
              공지사항이 없습니다.
            </Typography>
          )}

          {!loading && !error && notices.length > 0 && (
            <List sx={{ p: 0 }}>
              {notices.map((notice, index) => (
                <ListItem
                  key={notice.id}
                  sx={{
                    py: 1.2,
                    px: 0,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    borderBottom: index < notices.length - 1 ? '1px solid #dee2e6' : 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 44, 95, 0.04)'
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: '#212529',
                          fontSize: '14px',
                          mb: 0.5
                        }}
                      >
                        {notice.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                          variant="caption"
                          sx={{ color: '#6c757d', fontSize: '12px' }}
                        >
                          {notice.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: '#6c757d', fontSize: '12px' }}
                        >
                          {formatDate(notice.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NoticeOverview;
