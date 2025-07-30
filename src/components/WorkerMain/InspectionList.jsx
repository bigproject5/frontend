import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Pagination
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

const InspectionList = () => {
  // 현대차 스타일 색상 팔레트 (심플하고 깔끔하게)
  const colors = {
    primary: '#002c5f',      // 현대차 진한 남색
    secondary: '#6c757d',    // 회색
    background: '#f8f9fa',   // 연한 회색 배경
    surface: '#ffffff',      // 흰색
    border: '#dee2e6',       // 연한 회색 테두리
    text: '#212529',         // 진한 회색 텍스트
    textSecondary: '#6c757d', // 보조 텍스트
    // 상태별 색상 (현대차 스타일에 맞게 단순화)
    pending: '#007bff',      // 파란색 (대기중)
    inProgress: '#ffc107',   // 노란색 (진행중)
    completed: '#28a745',    // 초록색 (완료)
    defect: '#dc3545'        // 빨간색 (불량)
  };

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // 한 페이지당 10개

  // 샘플 검사 데이터 (실제로는 API에서 받아올 데이터)
  const sampleInspections = [
    {
      inspectionId: "1",
      inspectionType: "PAINT",
      status: "IN_ACTION",
      isDefect: false,
      workerId: 1,
      workerName: "ekek54",
      taskStartedAt: "2025-07-30T14:02:09.711515"
    },
    {
      inspectionId: "2",
      inspectionType: "WELD",
      status: "PENDING",
      isDefect: false,
      workerId: 1,
      workerName: "ekek54",
      taskStartedAt: "2025-07-30T13:30:15.123456"
    },
    {
      inspectionId: "3",
      inspectionType: "ASSEMBLY",
      status: "COMPLETED",
      isDefect: true,
      workerId: 1,
      workerName: "ekek54",
      taskStartedAt: "2025-07-30T12:45:30.789012"
    },
    {
      inspectionId: "4",
      inspectionType: "PAINT",
      status: "IN_ACTION",
      isDefect: false,
      workerId: 1,
      workerName: "ekek54",
      taskStartedAt: "2025-07-30T11:20:45.321654"
    },
    {
      inspectionId: "5",
      inspectionType: "QUALITY_CHECK",
      status: "PENDING",
      isDefect: false,
      workerId: 1,
      workerName: "ekek54",
      taskStartedAt: "2025-07-30T10:15:20.987654"
    },
    {
      inspectionId: "6",
      inspectionType: "WELD",
      status: "COMPLETED",
      isDefect: false,
      workerId: 1,
      workerName: "ekek54",
      taskStartedAt: "2025-07-30T09:45:12.456789"
    },
    {
      inspectionId: "7",
      inspectionType: "ASSEMBLY",
      status: "PENDING",
      isDefect: false,
      workerId: 1,
      workerName: "ekek54",
      taskStartedAt: "2025-07-30T08:30:25.654321"
    },
    {
      inspectionId: "8",
      inspectionType: "QUALITY_CHECK",
      status: "IN_ACTION",
      isDefect: false,
      workerId: 1,
      workerName: "ekek54",
      taskStartedAt: "2025-07-30T07:15:38.789456"
    }
  ];

  // 검사 상태별 색상 및 텍스트 매핑
  const getStatusInfo = (status) => {
    switch (status) {
      case 'IN_ACTION':
        return {
          color: colors.inProgress,
          text: '진행중',
          bgColor: `${colors.inProgress}20`
        };
      case 'PENDING':
        return {
          color: colors.pending,
          text: '대기중',
          bgColor: `${colors.pending}20`
        };
      case 'COMPLETED':
        return {
          color: colors.completed,
          text: '완료',
          bgColor: `${colors.completed}20`
        };
      default:
        return {
          color: colors.secondary,
          text: '알 수 없음',
          bgColor: `${colors.secondary}20`
        };
    }
  };

  // 검사 타입 한글 변환
  const getInspectionTypeText = (type) => {
    switch (type) {
      case 'PAINT': return '도장 검사';
      case 'WELD': return '용접 검사';
      case 'ASSEMBLY': return '조립 검사';
      case 'QUALITY_CHECK': return '품질 검사';
      default: return type;
    }
  };

  // 날짜 포맷팅
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '날짜 없음';
      }
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('DateTime formatting error:', error);
      return '날짜 오류';
    }
  };

  // 검사 아이템 클릭 핸들러
  const handleInspectionClick = (inspectionId) => {
    try {
      console.log(`검사 상세 페이지로 이동: ${inspectionId}`);
      // 나중에 navigate(`/inspection/${inspectionId}`) 등으로 변경
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (event, value) => {
    try {
      setCurrentPage(value);
      console.log(`페이지 변경: ${value}`);
      // 나중에 API 호출
    } catch (error) {
      console.error('Pagination error:', error);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: `2px solid ${colors.primary}` }}>
          <AssignmentIcon sx={{ color: colors.primary, fontSize: 20 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: colors.text,
              fontSize: '16px'
            }}
          >
            검사 목록
          </Typography>
        </Box>

        {/* 검사 목록 */}
        <List sx={{ p: 0 }}>
          {sampleInspections.map((inspection, index) => {
            const statusInfo = getStatusInfo(inspection.status);
            return (
              <ListItem
                key={inspection.inspectionId}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 1,
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.surface,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: colors.background
                  },
                  '&:last-child': {
                    mb: 0
                  }
                }}
                onClick={() => handleInspectionClick(inspection.inspectionId)}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 500,
                          color: colors.text,
                          fontSize: '14px'
                        }}
                      >
                        {getInspectionTypeText(inspection.inspectionType)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {inspection.isDefect && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CircleIcon sx={{ fontSize: 8, color: colors.defect }} />
                            <Typography
                              variant="caption"
                              sx={{
                                color: colors.defect,
                                fontSize: '11px',
                                fontWeight: 500
                              }}
                            >
                              불량
                            </Typography>
                          </Box>
                        )}
                        <Chip
                          size="small"
                          label={statusInfo.text}
                          sx={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color,
                            fontSize: '11px',
                            height: '20px'
                          }}
                        />
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.textSecondary,
                            fontSize: '12px'
                          }}
                        >
                          검사 ID: {inspection.inspectionId}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.textSecondary,
                            fontSize: '12px'
                          }}
                        >
                          작업자: {inspection.workerName}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.textSecondary,
                          fontSize: '12px'
                        }}
                      >
                        시작일: {formatDateTime(inspection.taskStartedAt)}
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0 }}
                />
              </ListItem>
            );
          })}
        </List>

        {/* 페이지네이션 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pt: 2, borderTop: `1px solid ${colors.border}` }}>
          <Pagination
            count={5}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: colors.textSecondary,
                '&.Mui-selected': {
                  backgroundColor: colors.primary,
                  color: colors.surface
                },
                '&:hover': {
                  backgroundColor: colors.background
                }
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default InspectionList;
