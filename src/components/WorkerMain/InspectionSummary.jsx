import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const InspectionSummary = () => {
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

  // 샘플 집계 데이터 (실제로는 API에서 받아올 데이터)
  const summaryData = {
    pending: 12,
    inAction: 8,
    completed: 25
  };

  const totalCount = summaryData.pending + summaryData.inAction + summaryData.completed;

  // 상태별 정보 매핑
  const statusCards = [
    {
      title: '대기중',
      count: summaryData.pending,
      icon: <ScheduleIcon sx={{ fontSize: 24, color: colors.primary }} />
    },
    {
      title: '진행중',
      count: summaryData.inAction,
      icon: <PlayArrowIcon sx={{ fontSize: 24, color: colors.primary }} />
    },
    {
      title: '완료',
      count: summaryData.completed,
      icon: <CheckCircleIcon sx={{ fontSize: 24, color: colors.primary }} />
    }
  ];

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
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: `2px solid ${colors.primary}` }}>
          <AssessmentIcon sx={{ color: colors.primary, fontSize: 20 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: colors.text,
              fontSize: '16px'
            }}
          >
            검사 집계
          </Typography>
        </Box>

        {/* 총 검사 항목 */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: colors.textSecondary,
              fontSize: '14px',
              textAlign: 'left'
            }}
          >
            총 검사 항목: <strong>{totalCount}개</strong>
          </Typography>
        </Box>

        {/* 상태별 카드들 */}
        <Grid container spacing={2}>
          {statusCards.map((card, index) => (
            <Grid item xs={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: 1,
                  backgroundColor: colors.surface,
                  '&:hover': {
                    backgroundColor: colors.background
                  },
                  transition: 'background-color 0.2s ease'
                }}
              >
                <CardContent
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    '&:last-child': { pb: 2 }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {card.icon}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: colors.text,
                        fontSize: '14px'
                      }}
                    >
                      {card.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: colors.primary,
                      fontSize: '18px'
                    }}
                  >
                    {card.count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InspectionSummary;
