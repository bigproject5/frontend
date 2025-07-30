import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon
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
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 최근 공지사항인지 확인 (3일 이내)
  const isRecentNotice = (dateString) => {
    const noticeDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - noticeDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  // 더보기 클릭 핸들러 (나중에 라우팅 연결 예정)
  const handleViewMore = () => {
    console.log('전체 공지사항 목록으로 이동');
    // 나중에 navigate('/notifications') 등으로 변경
  };

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        overflow: 'visible',
        minWidth: '600px',
        width: '100%'
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* 헤더 */}
        <Box sx={{
          p: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NotificationsIcon sx={{ fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold">
              공지사항
            </Typography>
          </Box>
          <IconButton sx={{ color: 'white' }}>
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* 컨텐츠 영역 */}
        <Box sx={{
          backgroundColor: 'white',
          color: 'text.primary',
          borderRadius: '16px 16px 0 0',
          p: 3,
          minHeight: 300
        }}>
          {/* 공지사항 목록 헤더 */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              최근 소식
            </Typography>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={handleViewMore}
              sx={{
                fontSize: '0.875rem',
                fontWeight: 'medium',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              + 더보기
            </Button>
          </Box>

          <List sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 1 }}>
            {notices.map((notice) => (
              <ListItem
                key={notice.notificationId}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 0.25,
                  py: 0.5,
                  px: 1.5,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateY(-1px)',
                    boxShadow: 1
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.875rem' }}>
                        {notice.title}
                      </Typography>
                      {isRecentNotice(notice.createdAt) && (
                        <Chip
                          label="NEW"
                          size="small"
                          color="error"
                          sx={{ fontSize: '0.55rem', height: 16, minHeight: 16 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        작성자: {notice.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {formatDate(notice.createdAt)}
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0 }}
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
