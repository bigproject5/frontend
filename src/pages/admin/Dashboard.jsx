import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Box,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Button,
} from "@mui/material";
import {
  Search,
  ArrowForward,
  DirectionsCar,
  Assessment,
  CheckCircle,
  Error as ErrorIcon,
  Schedule,
  Refresh
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const statusConfig = {
  IN_PROGRESS: {
    color: "#f59e0b",
    bgColor: "#fffbeb",
    label: "진행중",
    icon: <Schedule fontSize="small" />
  },
  COMPLETED: {
    color: "#22c55e",
    bgColor: "#f0fdf4",
    label: "완료",
    icon: <CheckCircle fontSize="small" />
  },
  PENDING: {
    color: "#64748b",
    bgColor: "#f8fafc",
    label: "대기",
    icon: <Schedule fontSize="small" />
  },
  IN_DIAGNOSIS: {
    color: "#3b82f6",
    bgColor: "#eff6ff",
    label: "진단중",
    icon: <Assessment fontSize="small" />
  }
};

const inspectionTypeNames = {
  PAINT: "도장",
  LAMP: "램프",
  WIPER: "와이퍼",
  ENGINE: "엔진",
  EM_WAVE: "전자파",
  WASHER_FLUID: "워셔액"
};

const Dashboard = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("testAt-desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statistics, setStatistics] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    pending: 0,
    withDefects: 0
  });

  const fetchAudits = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:8080/api/vehicleaudit/audits`,
        {
          params: {
            size: ITEMS_PER_PAGE,
            page: page - 1, // API는 0-based, UI는 1-based
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.code === "SUCCESS" && response.data.data) {
        const responseData = response.data.data;
        setAudits(responseData.content || []);
        setTotalPages(responseData.totalPages || 0);
        setTotalElements(responseData.totalElements || 0);

        // 통계 계산
        calculateStatistics(responseData.content || []);
      } else {
        throw new Error(response.data.message || "데이터 형식이 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("감사 목록 조회 실패:", err);
      setError(
        err.response?.data?.message || err.message || "데이터를 불러오는데 실패했습니다."
      );
      // 에러 시 빈 배열로 설정
      setAudits([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (auditList) => {
    const stats = {
      total: auditList.length,
      inProgress: 0,
      completed: 0,
      pending: 0,
      withDefects: 0
    };

    auditList.forEach(audit => {
      switch(audit.status) {
        case 'IN_PROGRESS':
          stats.inProgress += 1;
          break;
        case 'COMPLETED':
          stats.completed += 1;
          break;
        case 'PENDING':
          stats.pending += 1;
          break;
      }

      // 불량이 있는 차량 계산
      if (audit.inspections && audit.inspections.some(inspection => inspection.isDefect)) {
        stats.withDefects += 1;
      }
    });

    setStatistics(stats);
  };

  // 테스트 데이터 생성 함수
  const createTestAudit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8080/api/vehicleaudit/audits`,
        {
          model: "SONATA",
          lineCode: "A" + Math.floor(Math.random() * 5 + 1),
        }
      );

      if (response.data.code === "SUCCESS") {
        // 성공 시 목록 새로고침
        await fetchAudits();
        console.log("테스트 감사 생성 성공:", response.data.data);
      } else {
        throw new Error(response.data.message || "테스트 감사 생성에 실패했습니다.");
      }
    } catch (err) {
      console.error("테스트 감사 생성 실패:", err);
      setError("테스트 감사 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [page]);

  // 검색 필터링
  const filteredData = audits.filter(
    (item) =>
      item.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lineCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.auditId?.toString().includes(searchTerm)
  );

  // 정렬
  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortOption) {
      case "testAt-desc":
        return new Date(b.testAt) - new Date(a.testAt);
      case "testAt-asc":
        return new Date(a.testAt) - new Date(b.testAt);
      case "model-asc":
        return (a.model || "").localeCompare(b.model || "");
      case "model-desc":
        return (b.model || "").localeCompare(a.model || "");
      case "auditId-asc":
        return (a.auditId || 0) - (b.auditId || 0);
      case "auditId-desc":
        return (b.auditId || 0) - (a.auditId || 0);
      default:
        return 0;
    }
  });

  const getStatusChip = (status) => {
    const config = statusConfig[status];
    if (!config) {
      return <Chip label={status} size="small" />;
    }

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        size="small"
        sx={{
          bgcolor: config.bgColor,
          color: config.color,
          fontWeight: 600,
          '& .MuiChip-icon': {
            color: config.color,
          }
        }}
      />
    );
  };

  // 검사 진행률 계산
  const calculateProgress = (inspections) => {
    if (!inspections || inspections.length === 0) return 0;
    const completed = inspections.filter(i =>
      i.status === 'COMPLETED' || i.status === 'DIAGNOSIS_COMPLETED'
    ).length;
    return Math.round((completed / inspections.length) * 100);
  };

  // 통계 카드 컴포넌트
  const StatCard = ({ title, value, color, icon }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
          width: '150px',
          py: 3
        }}
      >
        <Box sx={{ color: color, mb: 2 }}>{icon}</Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: color, mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );


  if (loading && audits.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          데이터를 불러오는 중...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      // maxWidth: "1536px",
      display: 'flex',
      flexDirection: 'column',
      margin: "10%",
      marginTop: "100px"
    }}>
      {/* 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", color: '#1976d2' }}>
          차량 검사 관리 대시보드
        </Typography>
        <Typography variant="body1" color="text.secondary">
          실시간 차량 검사 현황을 확인하고 관리할 수 있습니다.
        </Typography>
      </Box>

      {/* 에러 표시 */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* 통계 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 차량 수"
            value={totalElements}
            color="#1976d2"
            icon={<DirectionsCar sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="진행 중"
            value={statistics.inProgress}
            color="#f59e0b"
            icon={<Schedule sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="완료"
            value={statistics.completed}
            color="#22c55e"
            icon={<CheckCircle sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="불량 발견"
            value={statistics.withDefects}
            color="#ef4444"
            icon={<ErrorIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
      </Grid>

      {/* 검색 및 필터 */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchAudits}
                  disabled={loading}
                  fullWidth
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  새로고침
                </Button>
                <Button
                  variant="contained"
                  onClick={createTestAudit}
                  disabled={loading}
                  fullWidth
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  테스트 생성
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 차량 목록 테이블 */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>차량 ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>모델</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>라인 코드</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>검사 항목</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>진행률</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>시작 시간</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>상태</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && audits.length > 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                  업데이트 중...
                </TableCell>
              </TableRow>
            ) : sortedData.length > 0 ? (
              sortedData.map((audit) => {
                const progress = calculateProgress(audit.inspections);
                const defectCount = audit.inspections?.filter(i => i.isDefect).length || 0;

                return (
                  <TableRow key={audit.auditId} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCar color="primary" />
                        <Typography fontWeight="bold">#{audit.auditId}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {audit.model || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={audit.lineCode || 'N/A'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {audit.inspections ? `${audit.inspections.length}개 항목` : '0개 항목'}
                      </Typography>
                      {defectCount > 0 && (
                        <Chip
                          label={`불량 ${defectCount}개`}
                          size="small"
                          color="error"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 8,
                            bgcolor: 'grey.200',
                            borderRadius: 4,
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              width: `${progress}%`,
                              height: '100%',
                              bgcolor: progress === 100 ? 'success.main' : 'primary.main',
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {audit.testAt ? new Date(audit.testAt).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(audit.status)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={Link}
                        to={`/admin/audits/${audit.auditId}`}
                        size="small"
                        color="primary"
                        sx={{
                          '&:hover': {
                            bgcolor: 'primary.lighter',
                            transform: 'translateX(2px)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ArrowForward />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <DirectionsCar sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {searchTerm ? '검색 결과가 없습니다.' : '차량 데이터가 없습니다.'}
                  </Typography>
                  {!searchTerm && (
                    <Typography variant="body2" color="text.secondary">
                      테스트 생성 버튼을 눌러 샘플 데이터를 만들어보세요.
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3
        }}>
          <Typography variant="body2" color="text.secondary">
            총 {totalElements}개 중 {((page - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(page * ITEMS_PER_PAGE, totalElements)}개 표시
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;