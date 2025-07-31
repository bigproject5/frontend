import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Card,
  CardContent,
  Avatar,
  Stack,
  IconButton,
  Badge,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  DirectionsCar,
  Build,
  CheckCircle,
  Warning,
  Error,
  Person,
  Schedule,
  ArrowBack,
  Visibility,
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:8080/api/vehicleaudit";

const statusConfig = {
  불량: {
    color: "#ef4444",
    bgColor: "#fef2f2",
    borderColor: "#fecaca",
    icon: Error,
    label: "불량"
  },
  "이상없음": {
    color: "#3b82f6",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
    icon: CheckCircle,
    label: "이상없음"
  },
};

const Detail = () => {
  const { carId } = useParams();
  const navigate = useNavigate();

  const [vehicleData, setVehicleData] = useState(null);
  const [inspectionsData, setInspectionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API 호출 함수들
  const fetchVehicleDetail = async (auditId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audits/${auditId}`);
      if (response.data.code === "200") {
        setVehicleData(response.data.data);
      } else {
        throw new Error(response.data.message || "차량 정보를 불러올 수 없습니다.");
      }
    } catch (err) {
      console.error("차량 상세 조회 실패:", err);
      throw err;
    }
  };

  const fetchInspectionsList = async (auditId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audits/${auditId}/inspections`);
      if (response.data.code === "200") {
        setInspectionsData(response.data.data || []);
      } else {
        throw new Error(response.data.message || "검사 목록을 불러올 수 없습니다.");
      }
    } catch (err) {
      console.error("검사 목록 조회 실패:", err);
      throw err;
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // carId를 auditId로 사용 (실제로는 carId -> auditId 매핑 필요할 수 있음)
      const auditId = carId;

      await Promise.all([
        fetchVehicleDetail(auditId),
        fetchInspectionsList(auditId)
      ]);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (carId) {
      loadData();
    }
  }, [carId]);

  const handlePartClick = (inspectionId) => {
    navigate(`/admin/inspection/${carId}-${inspectionId}`);
  };

  const getStatusIcon = (status) => {
    const IconComponent = statusConfig[status]?.icon || CheckCircle;
    return <IconComponent sx={{ color: statusConfig[status]?.color || "#3b82f6", fontSize: 20 }} />;
  };

  // 통계 계산
  const statusCounts = inspectionsData.reduce((acc, item) => {
    const status = item.status || "이상없음";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const totalParts = inspectionsData.length;
  const defectCount = statusCounts["불량"] || 0;
  const completionRate = totalParts > 0 ? Math.round(((totalParts - defectCount) / totalParts) * 100) : 100;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!vehicleData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          차량 정보를 찾을 수 없습니다.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", p: 3 }}>
      {/* 헤더 */}
      <Box mb={3}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "white", boxShadow: 1 }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={700} color="#1e293b">
              차량 상세 검사 정보
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              실시간 검사 현황 및 부품별 상태
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* 상단 정보 카드 */}
      <Grid container spacing={3} mb={4}>
        {/* 차량 정보 */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar sx={{ bgcolor: "#3b82f6", width: 48, height: 48 }}>
                  <DirectionsCar />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    차량 정보
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    기본 식별 정보
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={1.5}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">차량 ID</Typography>
                  <Typography variant="body2" fontWeight={600}>{vehicleData.vehicleId}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">모델</Typography>
                  <Typography variant="body2" fontWeight={600}>{vehicleData.model}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">상태</Typography>
                  <Typography variant="body2" fontWeight={600}>{vehicleData.status}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">작업라인</Typography>
                  <Typography variant="body2" fontWeight={600}>{vehicleData.line}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">검사일자</Typography>
                  <Typography variant="body2" fontWeight={600}>{vehicleData.inspectionDate}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 검사 상태 요약 */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar sx={{ bgcolor: "#10b981", width: 48, height: 48 }}>
                  <Build />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    검사 현황
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    완료율: {completionRate}%
                  </Typography>
                </Box>
              </Stack>

              {/* 상태별 통계 */}
              <Stack spacing={2}>
                {Object.entries(statusCounts).map(([status, count]) => (
                  <Box key={status} display="flex" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {getStatusIcon(status)}
                      <Typography variant="body2" fontWeight={500}>
                        {status}
                      </Typography>
                    </Stack>
                    <Badge
                      badgeContent={count}
                      sx={{
                        "& .MuiBadge-badge": {
                          bgcolor: statusConfig[status]?.color || "#3b82f6",
                          color: "white",
                          fontWeight: 600
                        }
                      }}
                    >
                      <Box sx={{ width: 20 }} />
                    </Badge>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 검사 항목 섹션 */}
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={3}>
            검사 항목 상세 ({totalParts}개)
          </Typography>

          {inspectionsData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                검사 항목이 없습니다.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {inspectionsData.map((part, idx) => {
                const config = statusConfig[part.status] || statusConfig["이상없음"];
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={part.inspectionId}>
                    <Card
                      elevation={0}
                      sx={{
                        border: `2px solid ${config.borderColor}`,
                        borderRadius: 2,
                        bgcolor: config.bgColor,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                          borderColor: config.color,
                        }
                      }}
                      onClick={() => handlePartClick(part.inspectionId)}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {part.part}
                          </Typography>
                          <IconButton size="small" sx={{ bgcolor: "rgba(255,255,255,0.8)" }}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Stack>

                        <Stack spacing={1}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Schedule sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {part.inspectionTime || "-"}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Person sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {part.worker || "-"}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Divider sx={{ my: 1.5 }} />

                        <Stack direction="row" alignItems="center" spacing={1}>
                          {getStatusIcon(part.status)}
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ color: config.color }}
                          >
                            {part.status}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Detail;