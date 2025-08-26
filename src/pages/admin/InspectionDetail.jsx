import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {fetchInspectionDetail} from "../../api/adminApi";
import { startTask, completeTask, saveResolve } from '../../api/workerTaskApi';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Alert,
  Button,
  TextField
} from '@mui/material';
import {
  VideoLibrary as VideoIcon,
  Info as InfoIcon,
  Psychology as AIIcon,
  Assignment as TaskIcon,
  Edit as EditIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const InspectionDetail = () => {
  const { inspectionId } = useParams();
  const [inspectionData, setInspectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolveText, setResolveText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Redux에서 사용자 정보 가져오기
  const { user, role } = useSelector(state => state.auth);

  // 디버깅용 로그 추가
  console.log('[InspectionDetail] user role:', role);

  useEffect(() => {
    const loadInspectionDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const responseData = await fetchInspectionDetail(inspectionId);

        // Enhanced Debugging
        if (!responseData || !responseData.code) {
            console.log(
                "**************************************************\n" +
                "********** 여기를 확인해주세요! **********\n" +
                "서버 응답이 비어있거나 code 필드가 없습니다.\n" +
                "받은 데이터:", responseData,
                "\n**************************************************"
            );
            throw new Error('서버로부터 비정상적인 응답을 받았습니다.');
        }

        if (responseData.code === 'SUCCESS') {
          const data = responseData.data; // 원본 데이터 변수화
          setInspectionData(data);
          console.log('[InspectionDetail] 상세 조회 성공');
          console.log(' - task.workerId:', data?.task?.workerId);
          console.log(' - user.id:', user?.id);
        } else {
          // 서버가 에러 코드를 보냈을 경우
          console.log(
            "**************************************************\n" +
            "********** 여기를 확인해주세요! **********\n" +
            "서버가 SUCCESS 대신 보낸 응답 내용:", responseData,
            "\n**************************************************"
          );
          throw new Error(responseData.message || '데이터를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error("검사 상세 정보 조회 실패:", err);
        // Axios 에러의 경우, 실제 서버 응답을 보여주는 것이 유용
        if (err.response) {
            console.log("Axios 에러 응답:", err.response);
        }
        setError(err.message || '검사 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadInspectionDetail();
  }, [inspectionId, user?.id]);

  

  // 조치 사항 저장 API
  const handleSaveResolve = async () => {
    try {
      const result = await saveResolve(inspectionId, resolveText);
      if (result.code === 'SUCCESS') {
        alert('조치 사항이 저장되었습니다.');
        await fetchInspectionDetail(); // 페이지 새로고침 대신 데이터 재조회
      } else {
        alert('조치 사항 저장에 실패했습니다: ' + (result.message || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('조치 사항 저장 실패:', error);
      if (error.message.includes('인증 토큰')) {
        alert(error.message);
      } else if (error.response?.status === 401) {
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
      } else {
        alert('조치 사항 저장에 실패했습니다: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // 작업 시작 API
  const handleStartTask = async () => {
    const confirmed = window.confirm('작업을 시작하시겠습니까?');
    if (!confirmed) return;

    try {
      const result = await startTask(inspectionId);
      if (result.code === 'SUCCESS') {
        alert('작업이 시작되었습니다.');
        await fetchInspectionDetail(); // 페이지 새로고침 대신 데이터 재조회
      } else {
        alert('작업 시작에 실패했습니다: ' + (result.message || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('작업 시작 실패:', error);
      if (error.message.includes('인증 토큰')) {
        alert(error.message);
      } else if (error.response?.status === 401) {
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
      } else {
        alert('작업 시작에 실패했습니다: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // 작업 완료 API
  const handleCompleteTask = async () => {
    const confirmed = window.confirm('작업을 완료하시겠습니까?');
    if (!confirmed) return;

    try {
      const result = await completeTask(inspectionId, resolveText);
      if (result.code === 'SUCCESS') {
        alert('작업이 완료되었습니다.');
        await fetchInspectionDetail(); // 페이지 새로고침 대신 데이터 재조회
      } else {
        alert('작업 완료에 실패했습니다: ' + (result.message || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('작업 완료 실패:', error);
      if (error.message.includes('인증 토큰')) {
        alert(error.message);
      } else if (error.response?.status === 401) {
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
      } else {
        alert('작업 완료에 실패했습니다: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'IN_DIAGNOSIS': { color: '#9c27b0', text: '진단중', bgcolor: '#f3e5f5' },
      'NORMAL': { color: '#4caf50', text: '정상', bgcolor: '#e8f5e8' },
      'ABNORMAL': { color: '#f44336', text: '이상', bgcolor: '#ffebee' },
      'IN_ACTION': { color: '#ff9800', text: '작업중', bgcolor: '#fff8e1' },
      'COMPLETED': { color: '#2196f3', text: '완료', bgcolor: '#e3f2fd' },
      'PENDING': { color: '#6b7280', text: '대기중', bgcolor: '#f3f4f6' },
      'FAILED': { color: '#ef4444', text: '실패', bgcolor: '#fee2e2' }
    };
    return statusMap[status] || statusMap['PENDING'];
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

  // 버튼 표시 조건 계산
  const getButtonCondition = () => {
    if (!inspectionData) return { showButton: false, buttonText: '', isReadOnly: true };

    // 관리자인 경우 항상 readonly로 동작하고 버튼 숨김
    if (role === 'ADMIN') {
      console.log('[ButtonCondition] 관리자 권한으로 readonly 모드');
      return { showButton: false, buttonText: '', isReadOnly: true };
    }

    const currentUserId = user?.id;
    const taskWorkerId = inspectionData?.task?.workerId;

    // 디버깅 로그
    console.log('[ButtonCondition] status:', inspectionData?.status,
      'task.workerId:', taskWorkerId,
      'currentUserId:', currentUserId,
      'hasTask:', !!inspectionData?.task,
      'role:', role);

    // 1) ABNORMAL 상태이고 task가 없음 -> 시작 버튼
    if (inspectionData.status === 'ABNORMAL' && !inspectionData.task) {
      return { showButton: true, buttonText: '시작', isReadOnly: true };
    }

    // 2) 작업중(IN_ACTION) 상태이고 내가 담당자 -> 완료 버튼
    if (inspectionData.status === 'IN_ACTION' && taskWorkerId === currentUserId) {
      return { showButton: true, buttonText: '완료', isReadOnly: false };
    }

    // 3) ABNORMAL 상태이지만 task가 있고 내가 담당자 (상태 전환 지연 케이스)
    if (inspectionData.status === 'ABNORMAL' && inspectionData.task && taskWorkerId === currentUserId) {
      return { showButton: true, buttonText: '완료', isReadOnly: false };
    }

    return { showButton: false, buttonText: '', isReadOnly: true };
  };

  const buttonCondition = getButtonCondition();

  useEffect(() => {
    if (inspectionData?.task?.resolve) {
      setResolveText(inspectionData.task.resolve);
    }
    setIsEditing(!buttonCondition.isReadOnly);
  }, [inspectionData, buttonCondition.isReadOnly]);

  if (loading) {
    return (
      <Box sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        p: 4
      }}>
        <Box sx={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={40} sx={{ color: '#1976d2' }} />
          <Typography variant="body1" color="textSecondary">
            검사 정보를 불러오는 중...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        p: 4
      }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            오류가 발생했습니다
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (!inspectionData) {
    return (
      <Box sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        p: 4
      }}>
        <Alert severity="warning">
          <Typography variant="h6" sx={{ mb: 1 }}>
            검사 정보를 찾을 수 없습니다
          </Typography>
          <Typography variant="body2">
            요청하신 검사 정보가 존재하지 않습니다.
          </Typography>
        </Alert>
      </Box>
    );
  }

  const statusInfo = getStatusInfo(inspectionData.status);

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      // m: -3,  // 제거: 레이아웃 붕괴/좌측 치우침 원인
      p: { xs: 2, sm: 3 },
      backgroundColor: '#f8f9fa',
      boxSizing: 'border-box'
    }}>
      {/* 상단 헤더 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 4,
        maxWidth: '100%'
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#002c5f'
          }}
        >
          검사 ID: {inspectionData.inspectionId} / 검사 타입: {inspectionData.inspectionType}
        </Typography>

        <Chip
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

      {/* 1행: 4:3:3 비율 (모바일에서는 1열 스택) */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '4fr 3fr 3fr' },
        gap: { xs: 2, md: 3 },
        mb: 4,
        alignItems: 'stretch'
      }}>
        {/* 검사 미디어 카드 */}
        <Card elevation={2} sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#ffffff 0%,#f8f9fa 100%)', border: '1px solid #e9ecef', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all .3s', '&:hover': { boxShadow: '0 8px 25px rgba(0,44,95,.15)' } }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{
              p: 2,
              background: 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <VideoIcon sx={{ fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                  검사 미디어
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              <Box sx={{
                position: 'relative',
                width: '100%',
                height: '300px',
                backgroundColor: '#f9fafb',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #d1d5db',
                overflow: 'hidden'
              }}>
                {(() => {
                  // resultDataPath가 우선, 없으면 collectDataPath 사용
                  const mediaPath = inspectionData.resultDataPath || inspectionData.collectDataPath;

                  if (mediaPath) {
                    const fileExtension = mediaPath.split('.').pop().toLowerCase();
                    const isVideo = ['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(fileExtension);
                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);

                    if (isVideo) {
                      return (
                        <Box
                          component="video"
                          width="100%"
                          height="100%"
                          controls
                          sx={{ borderRadius: 2 }}
                        >
                          <source src={mediaPath} type="video/mp4" />
                          Your browser does not support the video tag.
                        </Box>
                      );
                    } else if (isImage) {
                      return (
                        <Box
                          component="img"
                          src={mediaPath}
                          alt="검사 결과 이미지"
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            borderRadius: 2
                          }}
                        />
                      );
                    } else {
                      return (
                        <Typography variant="body2" color="textSecondary" textAlign="center">
                          지원하지 않는 파일 형식입니다.
                        </Typography>
                      );
                    }
                  } else {
                    return (
                      <Typography variant="body2" color="textSecondary" textAlign="center">
                        검사 미디어가 없습니다.
                      </Typography>
                    );
                  }
                })()}
              </Box>
            </Box>
          </CardContent>
        </Card>
        {/* 검사 정보 카드 */}
        <Card elevation={2} sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#ffffff 0%,#f9f9fa 100%)', border: '1px solid #e9ecef', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all .3s', '&:hover': { boxShadow: '0 8px 25px rgba(0,44,95,.15)' } }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{
              p: 2,
              background: 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <InfoIcon sx={{ fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                  검사 정보
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  검사 ID
                </Typography>
                <Box sx={{
                  mt: 0.5,
                  p: 1.5,
                  backgroundColor: '#f9fafb',
                  borderRadius: 1,
                  border: '1px solid #e5e7eb'
                }}>
                  <Typography variant="body2" color="textPrimary">
                    {inspectionData.inspectionId}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  검사 타입
                </Typography>
                <Box sx={{
                  mt: 0.5,
                  p: 1.5,
                  backgroundColor: '#f9fafb',
                  borderRadius: 1,
                  border: '1px solid #e7e9eb'
                }}>
                  <Typography variant="body2" color="textPrimary">
                    {inspectionData.inspectionType}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  불량 여부
                </Typography>
                <Box sx={{
                  mt: 0.5,
                  p: 1.5,
                  backgroundColor: inspectionData.isDefect ? '#fef2f2' : '#f0fdf4',
                  borderRadius: 1,
                  border: `1px solid ${inspectionData.isDefect ? '#fecaca' : '#bbf7d0'}`
                }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: inspectionData.isDefect ? '#dc2626' : '#16a34a',
                      fontWeight: 600
                    }}
                  >
                    {inspectionData.isDefect ? '불량' : '정상'}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  검사 결과
                </Typography>
                <Box sx={{
                  mt: 0.5,
                  p: 1.5,
                  backgroundColor: '#f9fafb',
                  borderRadius: 1,
                  border: '1px solid #e5e7eb'
                }}>
                  <Typography
                    variant="body2"
                    color="textPrimary"
                  >
                    {inspectionData.diagnosisResult || '-'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
        {/* 작업 현황 카드 */}
        <Card elevation={2} sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#ffffff 0%,#f9f9fa 100%)', border: '1px solid #e9ecef', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all .3s', '&:hover': { boxShadow: '0 8px 25px rgba(0,44,95,.15)' } }}>
          <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{
              p: 2,
              background: 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PersonIcon sx={{ fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                  작업 현황
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <Box>
                <Typography variant="caption" sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  담당 작업자
                </Typography>
                <Box sx={{
                  mt: 0.5,
                  p: 1.5,
                  backgroundColor: '#f9fafb',
                  borderRadius: 1,
                  border: '1px solid #e7e9eb'
                }}>
                  <Typography variant="body2" color="textPrimary">
                    {inspectionData.task?.workerName || '-'}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  작업 시작 시간
                </Typography>
                <Box sx={{
                  mt: 0.5,
                  p: 1.5,
                  backgroundColor: '#f9fafb',
                  borderRadius: 1,
                  border: '1px solid #e7e9eb'
                }}>
                  <Typography variant="body2" color="textPrimary">
                    {formatDateTime(inspectionData.task?.startedAt)}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  작업 완료 시간
                </Typography>
                <Box sx={{
                  mt: 0.5,
                  p: 1.5,
                  backgroundColor: inspectionData.task?.endedAt ? '#f0fdf4' : '#f9fafb',
                  borderRadius: 1,
                  border: `1px solid ${inspectionData.task?.endedAt ? '#bbf7d0' : '#e7e9eb'}`
                }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: inspectionData.task?.endedAt ? '#16a34a' : '#374151'
                    }}
                  >
                    {formatDateTime(inspectionData.task?.endedAt) || '진행 중'}
                  </Typography>
                </Box>
              </Box>

              {/* 카드 내부 우측 하단에 버튼 배치 */}
              {buttonCondition.showButton && (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 'auto',
                  pt: 2
                }}>
                  {buttonCondition.buttonText === '시작' && (
                    <Button
                      variant="contained"
                      onClick={handleStartTask}
                      sx={{
                        borderRadius: 2,
                        paddingX: 3,
                        paddingY: 1.5,
                        backgroundColor: '#4caf50',
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#388e3c'
                        }
                      }}
                    >
                      {buttonCondition.buttonText}
                    </Button>
                  )}

                  {buttonCondition.buttonText === '완료' && (
                    <Button
                      variant="contained"
                      onClick={handleCompleteTask}
                      sx={{
                        borderRadius: 2,
                        paddingX: 3,
                        paddingY: 1.5,
                        backgroundColor: '#1976d2',
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#155a8a'
                        }
                      }}
                    >
                      {buttonCondition.buttonText}
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 2행: 5:5 (동일 1:1) */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: { xs: 2, md: 3 },
        alignItems: 'stretch'
      }}>
        {/* AI 리포트 */}
        <Card elevation={2} sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#ffffff 0%,#f8f9fa 100%)', border: '1px solid #e9ecef', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all .3s', '&:hover': { boxShadow: '0 8px 25px rgba(0,44,95,.15)' } }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{
              p: 2,
              background: 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AIIcon sx={{ fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                  AI 리포트
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
                border: '1px solid #e0e7ff',
                borderRadius: 2,
                minHeight: '320px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.6,
                    color: '#374151',
                    fontStyle: 'italic'
                  }}
                >
                  {inspectionData.aiSuggestion || '조치 제안 없음'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        {/* 조치 내용 */}
        <Card elevation={2} sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#ffffff 0%,#f9f9fa 100%)', border: '1px solid #e9ecef', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all .3s', '&:hover': { boxShadow: '0 8px 25px rgba(0,44,95,.15)' } }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{
              p: 2,
              background: 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EditIcon sx={{ fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                  조치 내용
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              {!buttonCondition.isReadOnly ? (
                // 편집 가능한 상태 - TextField로 표시
                <TextField
                  multiline
                  rows={12}
                  variant="outlined"
                  value={resolveText}
                  onChange={(e) => setResolveText(e.target.value)}
                  placeholder="조치 내용을 입력하세요..."
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      height: '100%',
                      alignItems: 'stretch',
                      '& textarea': {
                        height: '100% !important',
                        overflow: 'auto !important'
                      },
                      '& fieldset': {
                        borderColor: '#e5e7eb'
                      },
                      '&:hover fieldset': {
                        borderColor: '#1976d2'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1976d2'
                      }
                    }
                  }}
                />
              ) : (
                // 읽기 전용 상태 - 기존 스타일 유지
                <Box sx={{
                  minHeight: '320px',
                  p: 3,
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 2,
                  whiteSpace: 'pre-wrap',
                  flex: 1
                }}>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.6,
                      color: '#374151'
                    }}
                  >
                    {(inspectionData.task?.resolve && inspectionData.task.resolve.trim()) || '조치 내용이 없습니다.'}
                  </Typography>
                </Box>
              )}

              {/* 저장 버튼 - 완료 버튼이 보이는 조건에서만 표시 */}
              {!buttonCondition.isReadOnly && (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 2
                }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveResolve}
                    sx={{
                      borderRadius: 2,
                      paddingX: 3,
                      paddingY: 1.5,
                      backgroundColor: '#4caf50',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#388e3c'
                      }
                    }}
                  >
                    저장
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default InspectionDetail;
