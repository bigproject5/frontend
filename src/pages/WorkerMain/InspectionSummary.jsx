import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { PendingActions, PlayArrow, CheckCircle, Search, Assessment } from '@mui/icons-material';

const InspectionSummary = ({ summaryData, onStatusFilter, selectedStatus }) => {
  const statusItems = [
    {
      label: '진단중',
      value: summaryData.inDiagnosis,
      status: 'IN_DIAGNOSIS',
      icon: <Search sx={{ fontSize: 32, color: '#9c27b0' }} />,
      color: '#9c27b0',
      bgColor: '#f3e5f5' // 더 연한 보라색 배경
    },
    {
      label: '정상',
      value: summaryData.normal,
      status: 'NORMAL',
      icon: <CheckCircle sx={{ fontSize: 32, color: '#4caf50' }} />,
      color: '#4caf50',
      bgColor: '#e8f5e8' // 더 연한 초록색 배경
    },
    {
      label: '이상',
      value: summaryData.abnormal,
      status: 'ABNORMAL',
      icon: <PendingActions sx={{ fontSize: 32, color: '#f44336' }} />,
      color: '#f44336',
      bgColor: '#ffebee' // 더 연한 빨간색 배경
    },
    {
      label: '작업중',
      value: summaryData.inAction,
      status: 'IN_ACTION',
      icon: <PlayArrow sx={{ fontSize: 32, color: '#ff9800' }} />,
      color: '#ff9800',
      bgColor: '#fff8e1' // 더 연한 오렌지 배경
    },
    {
      label: '완료',
      value: summaryData.completed,
      status: 'COMPLETED',
      icon: <CheckCircle sx={{ fontSize: 32, color: '#2196f3' }} />,
      color: '#2196f3',
      bgColor: '#e3f2fd' // 더 연한 파란색 배경
    }
  ];

  const handleCardClick = (status) => {
    const newStatus = selectedStatus === status ? null : status;
    onStatusFilter(newStatus);
  };

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e9ecef',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 25px rgba(0,44,95,0.15)'
        }
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* 헤더 */}
        <Box sx={{
          p: 3,
          background: 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Assessment sx={{ fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              검사 집계
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* 총 검사 항목 */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#002c5f',
                fontWeight: 700,
                fontSize: '18px',
                textAlign: 'left'
              }}
            >
              총 검사 항목: <span style={{color: '#1976d2'}}>{summaryData.total}개</span>
            </Typography>
          </Box>

          {/* 상태별 카드들 */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {statusItems.map((item) => (
              <Card
                key={item.status}
                onClick={() => handleCardClick(item.status)}
                sx={{
                  flex: '1 1 calc(20% - 12px)', // 5개 카드가 한 줄에 들어가도록 조정
                  minWidth: '140px', // 최소 너비 설정
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: selectedStatus === item.status ? `3px solid ${item.color}` : '1px solid #e0e0e0',
                  background: selectedStatus === item.status
                    ? `linear-gradient(135deg, ${item.bgColor} 0%, ${item.color}15 100%)`
                    : `linear-gradient(135deg, ${item.bgColor} 0%, #ffffff 100%)`,
                  boxShadow: selectedStatus === item.status
                    ? `0 8px 25px ${item.color}25`
                    : '0 2px 10px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: `0 12px 30px ${item.color}30`,
                    background: `linear-gradient(135deg, ${item.bgColor} 0%, ${item.color}20 100%)`
                  }
                }}
              >
                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 2,
                  px: 1.5,
                  '&:last-child': { pb: 2 }
                }}>
                  {/* 상단: 아이콘 */}
                  <Box sx={{
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: `${item.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1
                  }}>
                    {React.cloneElement(item.icon, { sx: { fontSize: 24, color: item.color } })}
                  </Box>

                  {/* 중단: 라벨 */}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: item.color,
                      fontSize: '14px',
                      mb: 1,
                      textAlign: 'center'
                    }}
                  >
                    {item.label}
                  </Typography>

                  {/* 하단: 숫자와 "건" */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 0.5
                  }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: item.color,
                        fontSize: '1.8rem',
                        lineHeight: 1,
                        textShadow: `0 2px 4px ${item.color}25`
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: item.color,
                        fontSize: '14px',
                        fontWeight: 600
                      }}
                    >
                      건
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InspectionSummary;
