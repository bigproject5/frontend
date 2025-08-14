import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Chip,
  CircularProgress,
  Divider,
  Avatar
} from '@mui/material';
import {
  PendingActions,
  PlayArrow,
  CheckCircle,
  Search,
  Build as BuildIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

const InspectionList = ({
  inspections,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onInspectionClick
}) => {
  // 상태별 색상 및 라벨 매핑 (아이콘 통일)
  const getStatusInfo = (status) => {
    switch (status) {
      case 'ABNORMAL':
        return {
          label: '대기중',
          color: '#ff9800',
          bgColor: '#fff8e1',
          icon: <PendingActions sx={{ fontSize: 20 }} />
        };
      case 'IN_ACTION':
        return {
          label: '진행중',
          color: '#2196f3',
          bgColor: '#e3f2fd',
          icon: <PlayArrow sx={{ fontSize: 20 }} />
        };
      case 'IN_DIAGNOSIS':
        return {
          label: '진단중',
          color: '#9c27b0',
          bgColor: '#f3e5f5',
          icon: <Search sx={{ fontSize: 20 }} />
        };
      case 'COMPLETED':
        return {
          label: '완료',
          color: '#4caf50',
          bgColor: '#e8f5e8',
          icon: <CheckCircle sx={{ fontSize: 20 }} />
        };
      case 'NORMAL':
        return {
            label: '정상',
            color: '#4caf50',
            bgColor: '#e8f5e8',
            icon: <CheckCircle sx={{ fontSize: 20 }} />
        }
      default:
        return {
          label: '알 수 없음',
          color: '#9e9e9e',
          bgColor: '#f5f5f5',
          icon: <BuildIcon sx={{ fontSize: 20 }} />
        };
    }
  };

  // 검사 타입 한글 변환
  const getInspectionTypeLabel = (type) => {
    switch (type) {
      case 'PAINT':
        return '도장';
      case 'BODY':
        return '차체';
      case 'ENGINE':
        return '엔진';
      default:
        return type;
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <BuildIcon sx={{ fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              검사 목록
            </Typography>
            {inspections.length > 0 && (
              <Chip
                label={`${inspections.length}건`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* 로딩 상태 */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
                  검사 목록을 불러오는 중...
                </Typography>
              </Box>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <AssignmentIcon sx={{ fontSize: 48, color: '#f44336', mb: 2 }} />
              <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                오류가 발생했습니다
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {error}
              </Typography>
            </Box>
          ) : (
            <>
              {/* 검사 목록 */}
              {inspections.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <AssignmentIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                    검사 목록이 없습니다
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    현재 조건에 맞는 검사 항목이 없습니다.
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {inspections.map((inspection, index) => {
                    const statusInfo = getStatusInfo(inspection.status);

                    return (
                      <React.Fragment key={inspection.inspectionId}>
                        <ListItem
                          onClick={() => onInspectionClick(inspection.inspectionId)}
                          sx={{
                            cursor: 'pointer',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            mb: 2,
                            border: '1px solid #e0e0e0',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            '&:hover': {
                              backgroundColor: statusInfo.bgColor,
                              border: `2px solid ${statusInfo.color}`,
                              transform: 'translateX(8px)',
                              boxShadow: `0 6px 20px ${statusInfo.color}25`
                            },
                            px: 3,
                            py: 2.5
                          }}
                        >
                          <Avatar
                            sx={{
                              backgroundColor: statusInfo.bgColor,
                              color: statusInfo.color,
                              mr: 2,
                              width: 48,
                              height: 48
                            }}
                          >
                            {statusInfo.icon}
                          </Avatar>

                          <ListItemText
                            primary={
                              <Box sx={{ mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 700,
                                      color: '#212529',
                                      fontSize: '18px'
                                    }}
                                  >
                                    검사 ID: {inspection.inspectionId}
                                  </Typography>
                                  <Chip
                                    label={getInspectionTypeLabel(inspection.inspectionType)}
                                    size="small"
                                    sx={{
                                      backgroundColor: '#002c5f',
                                      color: 'white',
                                      fontSize: '12px',
                                      fontWeight: 600
                                    }}
                                  />
                                  <Chip
                                    label={statusInfo.label}
                                    size="small"
                                    sx={{
                                      backgroundColor: statusInfo.color,
                                      color: 'white',
                                      fontSize: '12px',
                                      fontWeight: 600
                                    }}
                                  />
                                  {inspection.isDefect && (
                                    <Chip
                                      label="불량"
                                      size="small"
                                      sx={{
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        animation: 'pulse 2s infinite'
                                      }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
                                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                                    {inspection.workerName}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <ScheduleIcon sx={{ fontSize: 16, color: '#666' }} />
                                  <Typography variant="body2" color="textSecondary">
                                    {formatDate(inspection.taskStartedAt)}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>

                        {index < inspections.length - 1 && (
                          <Divider sx={{ mx: 3, opacity: 0.2 }} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </List>
              )}

              {/* 페이징 */}
              {totalPages > 1 && (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                  pt: 3,
                  borderTop: '1px solid #e9ecef'
                }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage + 1}
                    onChange={(event, page) => onPageChange(page - 1)}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontSize: '16px',
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default InspectionList;
