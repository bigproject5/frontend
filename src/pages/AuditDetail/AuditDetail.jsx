import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetch_audit_detail } from "../../api/vehicleAuditApi.jsx";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const inspectionTypeKor = {
  PAINT: "도장면",
  LAMP: "전조등",
  WIPER: "와이퍼",
  ENGINE: "엔진",
  EM_WAVE: "전자파",
  WASHER_FLUID: "워셔액"
};

const getStatusInfo = (status) => {
  const statusMap = {
    'IN_PROGRESS': { color: '#ff9800', text: '진행중', bgcolor: '#fff8e1', icon: ScheduleIcon },
    'COMPLETED': { color: '#2196f3', text: '완료', bgcolor: '#e3f2fd', icon: CheckCircleIcon },
    'ABNORMAL': { color: '#f44336', text: '이상', bgcolor: '#ffebee', icon: ErrorIcon },
    'NORMAL': { color: '#4caf50', text: '정상', bgcolor: '#e8f5e8', icon: CheckCircleIcon },
    'IN_DIAGNOSIS': { color: '#9c27b0', text: '진단중', bgcolor: '#f3e5f5', icon: AssessmentIcon }
  };
  return statusMap[status] || { color: '#6b7280', text: status, bgcolor: '#f3f4f6', icon: WarningIcon };
};

const getInspectionStatusInfo = (status, isDefect) => {
  // WorkerMain과 동일한 색상 체계 적용
  switch (status) {
    case 'IN_DIAGNOSIS':
      return {
        color: '#9c27b0',
        text: '진단중',
        bgcolor: '#f3e5f5',
        icon: AssessmentIcon
      };
    case 'NORMAL':
      return {
        color: '#4caf50',
        text: '정상',
        bgcolor: '#e8f5e8',
        icon: CheckCircleIcon
      };
    case 'ABNORMAL':
      return {
        color: '#f44336',
        text: '이상',
        bgcolor: '#ffebee',
        icon: ErrorIcon
      };
    case 'IN_ACTION':
      return {
        color: '#ff9800',
        text: '작업중',
        bgcolor: '#fff8e1',
        icon: WarningIcon
      };
    case 'COMPLETED':
      return {
        color: '#2196f3',
        text: '완료',
        bgcolor: '#e3f2fd',
        icon: CheckCircleIcon
      };
    default:
      return {
        color: '#9e9e9e',
        text: '알 수 없음',
        bgcolor: '#f5f5f5',
        icon: WarningIcon
      };
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  } catch (error) {
    return dateString;
  }
};

export default function AuditDetail() {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auditId } = useParams();
  const navigate = useNavigate();

  // 검사 아이템 클릭 핸들러 - 관리자 경로로 다시 변경
  const handleInspectionClick = (inspectionId) => {
    console.log('검사 상세 페이지로 이동:', inspectionId);
    navigate(`/admin/inspections/${inspectionId}`);
  };

  useEffect(() => {
    if (!auditId) {
      setError('Audit ID가 제공되지 않았습니다.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    fetch_audit_detail(auditId)
      .then(res => {
        if (res.code === 'SUCCESS' && res.data) {
          setCar(res.data);
        } else {
          setError('데이터를 불러올 수 없습니다.');
        }
      })
      .catch(err => {
        console.error('API 호출 오류:', err);
        setError('서버 연결에 실패했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [auditId]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={40} sx={{ color: '#1976d2' }} />
          <Typography variant="body1" color="textSecondary">
            검사 정보를 불러오는 중...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            오류가 발생했습니다
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (!car) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="warning">
          <Typography variant="h6" sx={{ mb: 1 }}>
            검사 정보를 찾을 수 없습니다
          </Typography>
          <Typography variant="body2">
            요청하신 검사 정보가 존재하지 않습니다.
          </Typography>
        </Alert>
      </Container>
    );
  }

  const statusInfo = getStatusInfo(car.status);
  const StatusIcon = statusInfo.icon;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* 헤더 */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#002c5f',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CarIcon sx={{ fontSize: 32 }} />
          {car.model} 검사 상세
        </Typography>

        <Chip
          icon={<StatusIcon />}
          label={statusInfo.text}
          sx={{
            backgroundColor: statusInfo.bgcolor,
            color: statusInfo.color,
            fontWeight: 600,
            fontSize: '14px',
            border: `2px solid ${statusInfo.color}`,
            px: 2,
            py: 1
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 기본 정보 카드 */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid #e9ecef',
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,44,95,0.15)'
            }
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{
              p: 2,
              background: 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BuildIcon sx={{ fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                  검사 기본 정보
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                      검사 ID
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#002c5f', fontWeight: 'bold' }}>
                      {car.auditId}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                      차량 모델
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#002c5f', fontWeight: 'bold' }}>
                      {car.model}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                      라인 코드
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#002c5f', fontWeight: 'bold' }}>
                      {car.lineCode}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                      검사 시각
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#002c5f', fontWeight: 'bold' }}>
                      {formatDateTime(car.testAt)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* 검사 항목 카드 */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid #e9ecef',
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,44,95,0.15)'
            }
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{
              p: 2,
              background: 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AssessmentIcon sx={{ fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                  검사 항목 ({car.inspections?.length || 0}개)
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              {car.inspections && car.inspections.length > 0 ? (
                <Grid container spacing={2}>
                  {car.inspections.map((inspection) => {
                    const inspectionStatus = getInspectionStatusInfo(inspection.status, inspection.isDefect);
                    const InspectionIcon = inspectionStatus.icon;

                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={inspection.inspectionId}>
                        <Card
                          elevation={1}
                          sx={{
                            height: '100%',
                            border: `2px solid ${inspectionStatus.color}`,
                            borderRadius: 2,
                            cursor: 'pointer', // 클릭 가능함을 시각적으로 표시
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: `0 8px 25px ${inspectionStatus.color}30`
                            }
                          }}
                          onClick={() => handleInspectionClick(inspection.inspectionId)} // 클릭 핸들러 추가
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              mb: 2
                            }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 'bold',
                                  color: '#002c5f',
                                  fontSize: '16px'
                                }}
                              >
                                {inspectionTypeKor[inspection.inspectionType] || inspection.inspectionType}
                              </Typography>
                              <InspectionIcon
                                sx={{
                                  color: inspectionStatus.color,
                                  fontSize: 20
                                }}
                              />
                            </Box>

                            <Box sx={{ mb: 2 }}>
                              <Chip
                                icon={<InspectionIcon />}
                                label={inspectionStatus.text}
                                size="small"
                                sx={{
                                  backgroundColor: inspectionStatus.bgcolor,
                                  color: inspectionStatus.color,
                                  fontWeight: 600,
                                  border: `1px solid ${inspectionStatus.color}`
                                }}
                              />
                            </Box>

                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1,
                              fontSize: '12px'
                            }}>
                              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                검사 ID: {inspection.inspectionId}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                상태: {inspection.status}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                불량 여부: {inspection.isDefect ? '불량' : '정상'}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Box sx={{
                  textAlign: 'center',
                  py: 4,
                  color: '#6b7280'
                }}>
                  <Typography variant="body1">
                    검사 데이터가 없습니다.
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
