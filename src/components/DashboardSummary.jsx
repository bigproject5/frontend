import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  InputAdornment,
  Button,
  Chip,
  Modal,
  IconButton,
  CircularProgress
} from "@mui/material";
import {
  Search,
  DirectionsCar,
  CheckCircle,
  Schedule,
  Refresh,
  Close,
  ZoomIn,
  PlayArrow,
  Pause
} from "@mui/icons-material";
import { useSelector } from 'react-redux';
import { getInspections } from '../api/workerMainApi';

const DashboardSummary = ({
  statistics,
  totalElements,
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  onRefresh,
  onCreateTest,
  loading
}) => {
  // Redux에서 사용자 정보 가져오기
  const user = useSelector(state => state.auth.user);
  const taskType = useSelector(state => state.auth.taskType);

  // 실시간 수집 데이터 상태
  const [recentInspections, setRecentInspections] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // 미디어 타입 판별 함수
  const getMediaType = (filePath) => {
    if (!filePath) return 'unknown';
    const extension = filePath.toLowerCase().split('.').pop();
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    if (videoExtensions.includes(extension)) return 'video';
    if (imageExtensions.includes(extension)) return 'image';
    return 'unknown';
  };

  // 실시간 수집 데이터 로딩 - 모든 검사 유형 포함
  const loadRecentInspections = async () => {
    if (!user) return;

    setMediaLoading(true);
    try {
      // inspectionType 필터링 없이 전체 데이터에서 최근 데이터 가져오기
      const response = await getInspections({
        user,
        // taskType 제거 - 모든 검사 유형 포함
        page: 0,
        size: 20, // collectDataPath 필터링 후 5개 확보를 위해 더 많이 가져옴
        sort: 'inspectionId,desc'
      });

      console.log('=== 실시간 수집 데이터 API 응답 분석 ===');
      console.log('전체 응답:', response);

      // API 응답 구조가 {code: 'SUCCESS', data: {...}} 형태이므로 data 안의 content에 접근
      const apiData = response.data || response; // response.data가 있으면 사용, 없으면 response 직접 사용
      console.log('API 데이터:', apiData);
      console.log('content 배열:', apiData.content);
      console.log('content 길이:', apiData.content?.length);

      // 각 항목의 구조 확인
      if (apiData.content && apiData.content.length > 0) {
        console.log('첫 번째 항목 구조:', apiData.content[0]);
        console.log('첫 번째 항목의 모든 키:', Object.keys(apiData.content[0]));

        // collectDataPath 확인
        apiData.content.slice(0, 3).forEach((item, index) => {
          console.log(`${index + 1}번째 항목:`, {
            inspectionId: item.inspectionId,
            inspectionType: item.inspectionType,
            collectDataPath: item.collectDataPath,
            status: item.status
          });
        });
      }

      // collectDataPath가 있는 데이터만 필터링하고 최대 5개까지만
      const filteredData = apiData.content?.filter(item => item.collectDataPath)?.slice(0, 5) || [];
      console.log('필터링된 데이터:', filteredData);
      console.log('필터링된 데이터 개수:', filteredData.length);

      setRecentInspections(filteredData);
      setCurrentMediaIndex(0);
    } catch (error) {
      console.error('실시간 수집 데이터 로딩 실패:', error);
      setRecentInspections([]);
    } finally {
      setMediaLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    loadRecentInspections();
  }, [user, taskType]);

  // 새로고침 버튼 클릭 시 데이터 다시 로딩
  const handleMediaRefresh = () => {
    loadRecentInspections();
    if (onRefresh) onRefresh();
  };

  // 이전/다음 미디어로 이동
  const handlePreviousMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === 0 ? recentInspections.length - 1 : prevIndex - 1
    );
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === recentInspections.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 이미지 클릭 시 모달 열기
  const handleImageClick = (imagePath) => {
    setSelectedImage(imagePath);
    setImageModalOpen(true);
  };

  // 이미지 모달 닫기
  const handleImageModalClose = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  // 현재 미디어 정보
  const currentMedia = recentInspections[currentMediaIndex];
  const mediaType = currentMedia ? getMediaType(currentMedia.collectDataPath) : 'unknown';

  // 통계 카드 컴포넌트 - WorkerMain과 통일된 디자인
  const StatCard = ({ title, value, color, icon, bgColor }) => (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        borderRadius: 2,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e9ecef',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 8px 25px rgba(0,44,95,0.15)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
          p: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: color,
            borderRadius: '2px 2px 0 0'
          }}
        />
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            transition: 'all 0.3s ease'
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 32, color: color } })}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: color, mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: '#002c5f', fontWeight: 600 }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 1 }}>
      {/* 2열 레이아웃: 좌측 검사 현황, 우측 영상 */}
      <Grid container spacing={5} sx={{ height: '100%' }}>
        {/* 좌측: 검사 현황 요약 + 통계 카드 + 검색 필터 */}
        <Grid item xs={12} md={3} sx={{ pl: 2 }}>
          <Card elevation={2} sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid #e9ecef',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s',
            '&:hover': { boxShadow: '0 8px 25px rgba(0,44,95,0.15)' }
          }}>
            <CardContent sx={{ p: 0, height: '100%' }}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
                {/* 첫 번째 Box: 검사 현황 요약 제목 */}
                <Box sx={{ mb: 3, width: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#002c5f' }}>
                    검사 현황 요약
                  </Typography>
                </Box>

                {/* 두 번째 Box: 통계 카드들 */}
                <Box sx={{ mb: 4, width: '100%' }}>
                  <Grid container spacing={3} sx={{ width: '100%' }}>
                    <Grid item xs={12} sm={4}>
                      <StatCard
                        title="총 차량 수"
                        value={totalElements}
                        color="#1976d2"
                        icon={<DirectionsCar />}
                        bgColor="#e3f2fd"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <StatCard
                        title="진행 중"
                        value={statistics.inProgress}
                        color="#f59e0b"
                        icon={<Schedule />}
                        bgColor="#fff3e0"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <StatCard
                        title="완료"
                        value={statistics.completed}
                        color="#22c55e"
                        icon={<CheckCircle />}
                        bgColor="#e8f5e9"
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* 검색 및 필터 */}
                <Box sx={{ width: '100%', flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#002c5f', mb: 3 }}>
                    검색 및 필터
                  </Typography>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} lg={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="차량 ID, 모델명, 라인코드로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                      <FormControl fullWidth>
                        <InputLabel>정렬</InputLabel>
                        <Select
                          value={sortOption}
                          label="정렬"
                          onChange={(e) => setSortOption(e.target.value)}
                        >
                          <MenuItem value="testAt-desc">최신순</MenuItem>
                          <MenuItem value="testAt-asc">오래된순</MenuItem>
                          <MenuItem value="auditId-desc">차량 ID (내림차순)</MenuItem>
                          <MenuItem value="auditId-asc">차량 ID (오름차순)</MenuItem>
                          <MenuItem value="model-asc">모델명 (오름차순)</MenuItem>
                          <MenuItem value="model-desc">모델명 (내림차순)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Refresh />}
                          onClick={onRefresh}
                          disabled={loading}
                          fullWidth
                          sx={{ whiteSpace: 'nowrap' }}
                        >
                          새로고침
                        </Button>
                        <Button
                          variant="contained"
                          onClick={onCreateTest}
                          disabled={loading}
                          fullWidth
                          sx={{ whiteSpace: 'nowrap' }}
                        >
                          테스트 생성
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 우측: 실시간 수집 데이터 */}
        <Grid item xs={12} md={9} sx={{
          minWidth: '600px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
            {/* 실시간 수집 데이터 카드 */}
            <Card elevation={2} sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid #e9ecef',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s',
              '&:hover': { boxShadow: '0 8px 25px rgba(0,44,95,0.15)' }
            }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{
                  p: 2,
                  color: '#002c5f',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      fontSize: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      📹
                    </Box>
                    <Typography variant="h6" sx={{
                      fontWeight: 600,
                      fontSize: '16px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      실시간 수집 데이터
                    </Typography>
                  </Box>

                  {/* 새로고침 버튼 추가 */}
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Refresh />}
                    onClick={handleMediaRefresh}
                    disabled={loading || mediaLoading}
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      py: 0.5,
                      borderColor: '#002c5f',
                      color: '#002c5f',
                      fontSize: '12px',
                      '&:hover': {
                        borderColor: '#001a3d',
                        backgroundColor: 'rgba(0, 44, 95, 0.05)',
                        color: '#001a3d'
                      }
                    }}
                  >
                    새로고침
                  </Button>
                </Box>

                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', px: 8 }}>
                  {/* 이전 영상 버튼 - 영상 칸 외부 왼쪽 */}
                  <Button
                    onClick={handlePreviousMedia}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      minWidth: 60,
                      height: 60,
                      background: 'transparent',
                      color: '#002c5f',
                      fontSize: '32px',
                      fontWeight: 'bold',
                      zIndex: 10,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(0, 44, 95, 0.1)',
                        color: '#001a3d',
                        transform: 'translateY(-50%) scale(1.1)'
                      }
                    }}
                  >
                    ‹
                  </Button>

                  {/* 영상 영역 - 고정 비율 및 안정적 레이아웃 */}
                  <Box sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '750px',
                    margin: '0 auto',
                    // 16:9 비율 고정 (aspect-ratio 대신 패딩 트릭 사용)
                    '&::before': {
                      content: '""',
                      display: 'block',
                      paddingTop: '56.25%' // 16:9 비율 (9/16 * 100%)
                    }
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: '#f9fafb',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed #d1d5db',
                      overflow: 'hidden',
                      minHeight: '300px', // 최소 높이 보장
                      maxHeight: '500px'  // 최대 높이 제한
                    }}>
                      {mediaLoading ? (
                        // 로딩 상태
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2
                        }}>
                          <CircularProgress />
                          <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                            데이터를 불러오는 중...
                          </Typography>
                        </Box>
                      ) : recentInspections.length === 0 ? (
                        // 데이터가 없을 때
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 2
                        }}>
                          <Box sx={{
                            fontSize: 48,
                            color: '#6b7280',
                            opacity: 0.7
                          }}>
                            📹
                          </Box>
                          <Typography variant="body2" sx={{ color: '#9ca3af', textAlign: 'center' }}>
                            수집된 데이터가 없습니다
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#d1d5db', textAlign: 'center' }}>
                            검사 데이터가 수집되면 여기에 표시됩니다
                          </Typography>
                        </Box>
                      ) : (
                        // 실제 미디어 데이터 표시
                        <Box sx={{
                          width: '100%',
                          height: '100%',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          // 호버 시 오버레이 표시를 위한 그룹 설정
                          '&:hover .media-info-overlay': {
                            opacity: 1,
                            visibility: 'visible'
                          }
                        }}>
                          {mediaType === 'video' ? (
                            // 비디오 플레이어 - 컨테이너에 맞춤
                            <video
                              controls
                              style={{
                                width: '100%',
                                height: '100%',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                backgroundColor: '#000' // 비디오 로딩 중 검은 배경
                              }}
                              src={currentMedia.collectDataPath}
                              onLoadStart={() => console.log('비디오 로딩 시작')}
                              onLoadedData={() => console.log('비디오 로딩 완료')}
                            >
                              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                브라우저가 비디오를 지원하지 않습니다.
                              </Typography>
                            </video>
                          ) : mediaType === 'image' ? (
                            // 이미지 표시 - 컨테이너에 맞춤
                            <Box
                              sx={{
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                '&:hover .zoom-overlay': {
                                  opacity: 1
                                }
                              }}
                              onClick={() => handleImageClick(currentMedia.collectDataPath)}
                            >
                              <img
                                src={currentMedia.collectDataPath}
                                alt="검사 이미지"
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain',
                                  borderRadius: '8px'
                                }}
                                onLoad={() => console.log('이미지 로딩 완료')}
                                onError={() => console.log('이미지 로딩 실패')}
                              />
                              {/* 확대 아이콘 오버레이 */}
                              <Box
                                className="zoom-overlay"
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  opacity: 0,
                                  transition: 'opacity 0.3s ease',
                                  borderRadius: '8px'
                                }}
                              >
                                <ZoomIn sx={{ fontSize: 48, color: '#fff' }} />
                              </Box>
                            </Box>
                          ) : (
                            // 알 수 없는 파일 형식
                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 2
                            }}>
                              <Box sx={{
                                fontSize: 48,
                                color: '#6b7280',
                                opacity: 0.7
                              }}>
                                📄
                              </Box>
                              <Typography variant="body2" sx={{ color: '#9ca3af', textAlign: 'center' }}>
                                지원하지 않는 파일 형식입니다
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#d1d5db', textAlign: 'center' }}>
                                {currentMedia.collectDataPath?.split('/').pop()}
                              </Typography>
                            </Box>
                          )}

                          {/* 미디어 정보 오버레이 - 호버 시 상단에 표시 */}
                          {currentMedia && (
                            <Box
                              className="media-info-overlay"
                              sx={{
                                position: 'absolute',
                                top: 8,  // 하단에서 상단으로 이동
                                left: 8,
                                right: 8,
                                backgroundColor: 'rgba(0, 0, 0, 0.8)', // 더 진한 배경으로 가독성 향상
                                borderRadius: 1,
                                p: 1.5, // 패딩 약간 증가
                                color: '#fff',
                                maxWidth: 'calc(100% - 16px)',
                                opacity: 0, // 기본적으로 숨김
                                visibility: 'hidden', // 완전히 숨김
                                transition: 'all 0.3s ease', // 부드러운 전환 효과
                                transform: 'translateY(-8px)', // 약간 위에서 등장하는 효과
                                backdropFilter: 'blur(4px)', // 배경 블러 효과 (선택사항)
                                border: '1px solid rgba(255, 255, 255, 0.1)', // 미묘한 테두리
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' // 그림자 효과
                              }}
                            >
                              <Typography variant="caption" sx={{ display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
                                🔍 검사 ID: {currentMedia.inspectionId}
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', fontSize: '0.75rem', opacity: 0.9 }}>
                                📋 유형: {currentMedia.inspectionType}
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem', opacity: 0.8 }}>
                                📁 파일: {currentMedia.collectDataPath?.split('/').pop()}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* 인디케이터 */}
                  {recentInspections.length > 0 && (
                    <Box sx={{
                      position: 'absolute',
                      bottom: -40,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: 1
                    }}>
                      {recentInspections.map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: index === currentMediaIndex ? '#002c5f' : '#d1d5db',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onClick={() => setCurrentMediaIndex(index)}
                        />
                      ))}
                    </Box>
                  )}

                  {/* 다음 영상 버튼 - 영상 칸 외부 오른쪽 */}
                  <Button
                    onClick={handleNextMedia}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      minWidth: 60,
                      height: 60,
                      background: 'transparent',
                      color: '#002c5f',
                      fontSize: '32px',
                      fontWeight: 'bold',
                      zIndex: 10,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(0, 44, 95, 0.1)',
                        color: '#001a3d',
                        transform: 'translateY(-50%) scale(1.1)'
                      }
                    }}
                  >
                    ›
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* 이미지 모달 */}
      <Modal
        open={imageModalOpen}
        onClose={handleImageModalClose}
        closeAfterTransition
        slots={{ backdrop: Close }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{
          width: '95%',
          maxWidth: '900px',
          height: '85%',
          maxHeight: '600px',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          position: 'relative',
          overflow: 'hidden',
          margin: 'auto'
        }}>
          {/* 닫기 버튼 */}
          <IconButton
            onClick={handleImageModalClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: '#fff',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
          >
            <Close />
          </IconButton>

          {/* 이미지 표시 */}
          {selectedImage && (
            <Box sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img
                src={selectedImage}
                alt="Selected"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
            </Box>
          )}

          {/* 로딩 인디케이터 */}
          {mediaLoading && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 2,
              zIndex: 10
            }}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default DashboardSummary;
