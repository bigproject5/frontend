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
          <List sx={{ p: 0 }}>
            {notices.map((notice, index) => (
              <ListItem
                key={notice.notificationId}
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
                        {notice.author}
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
        </Box>
      </CardContent>
    </Card>
  );
};

export default NoticeOverview;
