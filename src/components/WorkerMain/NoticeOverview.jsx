import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  KeyboardArrowRight as ArrowRightIcon
} from '@mui/icons-material';

const NoticeOverview = () => {
  // 현대차 스타일 색상 팔레트 (심플하고 깔끔하게)
  const colors = {
    primary: '#002c5f',      // 현대차 진한 남색
    secondary: '#6c757d',    // 회색
    background: '#f8f9fa',   // 연한 회색 배경
    surface: '#ffffff',      // 흰색
    border: '#dee2e6',       // 연한 회색 테두리
    text: '#212529',         // 진한 회색 텍스트
    textSecondary: '#6c757d' // 보조 텍스트
  };

  // 새로운 데이터 구조에 맞는 샘플 공지사항 데이터
  const notices = [
    {
      notificationId: "1",
      author: "admin125482",
      title: "시스템 점검 안내",
      content: "2024년 1월 15일 02:00 ~ 06:00 시스템 정기 점검이 예정되어 있습니다.",
      fileUrl: "url",
      createdAt: "2025-01-10T13:18:58.554331"
    },
    {
      notificationId: "2",
      author: "admin987654",
      title: "검사 프로세스 업데이트",
      content: "새로운 검사 프로세스가 적용되었습니다. 자세한 내용은 매뉴얼을 확인해주세요.",
      fileUrl: "url",
      createdAt: "2025-01-08T09:30:15.123456"
    },
    {
      notificationId: "3",
      author: "manager123",
      title: "품질관리 교육 완료",
      content: "모든 작업자의 품질관리 교육이 완료되었습니다.",
      fileUrl: "url",
      createdAt: "2025-01-05T16:45:30.789012"
    },
    {
      notificationId: "4",
      author: "admin456789",
      title: "새로운 검사 장비 도입",
      content: "최신 검사 장비가 도입되어 검사 정확도가 향상됩니다.",
      fileUrl: "url",
      createdAt: "2025-01-03T14:22:45.321654"
    },
    {
      notificationId: "5",
      author: "supervisor001",
      title: "안전 수칙 개정 안내",
      content: "작업장 안전 수칙이 개정되었습니다. 모든 작업자는 숙지 바랍니다.",
      fileUrl: "url",
      createdAt: "2025-01-01T11:15:20.987654"
    }
  ];

  // 날짜 포맷팅 함수
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

  // 최근 공지사항인지 확인 (3일 이내)
  const isRecentNotice = (dateString) => {
    try {
      const noticeDate = new Date(dateString);
      const today = new Date();
      const diffTime = Math.abs(today - noticeDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3;
    } catch (error) {
      console.error('Date comparison error:', error);
      return false;
    }
  };

  // 더보기 클릭 핸들러 (나중에 라우팅 연결 예정)
  const handleViewMore = () => {
    try {
      console.log('전체 공지사항 목록으로 이동');
      // 나중에 navigate('/notifications') 등으로 변경
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        mb: 2,
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            pb: 1,
            borderBottom: `2px solid ${colors.primary}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon sx={{ color: colors.primary, fontSize: 20 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: colors.text,
                fontSize: '16px'
              }}
            >
              최근 공지사항
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={handleViewMore}
            sx={{
              color: colors.primary,
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'none',
              padding: '4px 8px',
              '&:hover': {
                backgroundColor: colors.background
              }
            }}
            endIcon={<ArrowRightIcon sx={{ fontSize: 14 }} />}
          >
            더보기
          </Button>
        </Box>

        <List
          sx={{
            p: 0,
            border: `1px solid ${colors.border}`,
            borderRadius: 2,
            backgroundColor: colors.surface,
            boxShadow: '0 2px 8px rgba(0, 44, 95, 0.1)',
            overflow: 'hidden'
          }}
        >
          {notices.map((notice, index) => (
            <ListItem
              key={notice.notificationId}
              sx={{
                p: 1.2,
                mb: 0,
                backgroundColor: colors.surface,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                borderBottom: index < notices.length - 1 ? 'none' : 'none',
                '&:hover': {
                  backgroundColor: colors.background
                },
                '&:not(:last-child)::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '16px',
                  right: '16px',
                  height: '1px',
                  backgroundColor: colors.border
                },
                position: 'relative'
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 500,
                      color: colors.text,
                      fontSize: '14px',
                      mb: 0.3
                    }}
                  >
                    {notice.title}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.textSecondary,
                        fontSize: '12px'
                      }}
                    >
                      {notice.author}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.textSecondary,
                        fontSize: '12px'
                      }}
                    >
                      {formatDate(notice.createdAt)}
                    </Typography>
                  </Box>
                }
                sx={{ m: 0 }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default NoticeOverview;
