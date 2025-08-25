import React, { useState, useEffect } from "react";
import { fetchAudits as apiFetchAudits, createTestAudit as apiCreateTestAudit } from "../../api/adminApi";
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
  Pagination,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import {
  DirectionsCar,
  Assessment,
  CheckCircle,
  Schedule,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DashboardSummary from "../../components/DashboardSummary.jsx";

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
  }
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
    pending: 0
  });

  const navigate = useNavigate();

  const fetchAudits = async () => {
    try {
      setLoading(true);
      setError(null);

      const responseData = await apiFetchAudits(page, ITEMS_PER_PAGE);

      console.log("API Response:", responseData);

      if (responseData.code === "SUCCESS" && responseData.data) {
        const responseDataData = responseData.data;
        setAudits(responseDataData.content || []);
        setTotalPages(responseDataData.totalPages || 0);
        setTotalElements(responseDataData.totalElements || 0);

        // 통계 계산
        calculateStatistics(responseDataData.content || []);
      } else {
        throw new Error(responseData.message || "데이터 형식이 올바르지 않습니다.");
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
      pending: 0
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
    });

    setStatistics(stats);
  };

  // 테스트 데이터 생성 함수
  const createTestAudit = async () => {
    try {
      setLoading(true);
      const responseData = await apiCreateTestAudit();

      if (responseData.code === "SUCCESS") {
        // 성공 시 목록 새로고침
        await fetchAudits();
        console.log("테스트 감사 생성 성공:", responseData.data);
      } else {
        throw new Error(responseData.message || "테스트 감사 생성에 실패했습니다.");
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
      maxWidth: "1600px",
      width: "100%",
      mx: "auto",
      px: 0,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 헤더 - 단순한 남색 텍스트로 변경 */}
      <Box sx={{ mb: 4, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Assessment sx={{ fontSize: 32, color: '#002c5f' }} />
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#002c5f' }}>
            차량 검사 관리 대시보드
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ ml: 5 }}>
          실시간 차량 검사 현황을 확인하고 관리할 수 있습니다.
        </Typography>
      </Box>

      {/* 에러 표시 */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ mb: 3, mx: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* DashboardSummary 전체 너비 사용 - Grid 제거 */}
      <Box sx={{ mb: 4, width: '100%' }}>
        <DashboardSummary
          statistics={statistics}
          totalElements={totalElements}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
          onRefresh={fetchAudits}
          onCreateTest={createTestAudit}
          loading={loading}
        />
      </Box>

      {/* 차량 목록 테이블 */}
      <Box sx={{ px: 2 }}>
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
          {/* 헤더 */}
          <Box sx={{
            p: 3,
            background: 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DirectionsCar sx={{ fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                차량 검사 목록
              </Typography>
              {sortedData.length > 0 && (
                <Chip
                  label={`${totalElements}건`}
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

          <TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none' }}>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && audits.length > 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={24} sx={{ mr: 2 }} />
                      업데이트 중...
                    </TableCell>
                  </TableRow>
                ) : sortedData.length > 0 ? (
                  sortedData.map((audit) => {
                    const progress = calculateProgress(audit.inspections);

                    return (
                      <TableRow
                        key={audit.auditId}
                        hover
                        onClick={() => navigate(`/admin/audits/${audit.auditId}`)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
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
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
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
        </Card>

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
    </Box>
  );
};

export default Dashboard;
