import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  Avatar,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  PlayCircleOutline,
  PersonOutline,
  Assignment,
  SmartToy,
  AccessTime,
  ArrowBack,
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:8080/api/vehicleaudit";

const InspectionDetail = () => {
  const { inspectionId } = useParams();
  const navigate = useNavigate();

  const [inspectionData, setInspectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL에서 auditId와 inspectionId 추출
  const [auditId, realInspectionId] = inspectionId?.split("-") || ["", ""];

  // API 호출 함수
  const fetchInspectionDetail = async (auditId, inspectionId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/audits/${auditId}/inspections/${inspectionId}`);

      if (response.data.code === "200") {
        setInspectionData(response.data.data);
      } else {
        throw new Error(response.data.message || "검사 상세 정보를 불러올 수 없습니다.");
      }
    } catch (err) {
      console.error("검사 상세 조회 실패:", err);
      setError(err.response?.data?.message || err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auditId && realInspectionId) {
      fetchInspectionDetail(auditId, realInspectionId);
    } else {
      setError("유효하지 않은 검사 ID입니다.");
      setLoading(false);
    }
  }, [auditId, realInspectionId]);

  // 시간 포맷팅 함수
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "-";
    return new Date(dateTimeString).toLocaleString('ko-KR');
  };

  // 작업 시간 계산 함수
  const calculateWorkDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "-";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  // 상태에 따른 칩 색상
  const getStatusChipProps = (status) => {
    switch (status) {
      case "불량":
        return { color: "error", label: "불량 발견" };
      case "이상없음":
        return { color: "success", label: "정상" };
      case "조치완료":
        return { color: "primary", label: "조치 완료" };
      default:
        return { color: "default", label: status || "진행 중" };
    }
  };

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
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          돌아가기
        </Button>
      </Box>
    );
  }

  if (!inspectionData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          검사 상세 정보를 찾을 수 없습니다.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          돌아가기
        </Button>
      </Box>
    );
  }

  const statusChipProps = getStatusChipProps(inspectionData.status);
  const workDuration = calculateWorkDuration(inspectionData.startTime, inspectionData.endTime);

  return (
    <Box
      sx={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        p: { xs: 2, md: 3 }
      }}
    >
      {/* 헤더 섹션 */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white"
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
            <Assignment />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              검사 ID: {inspectionData.inspectionId}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              검사 파트: {inspectionData.part}
            </Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Chip
              label={statusChipProps.label}
              color={statusChipProps.color}
              sx={{
                bgcolor: statusChipProps.color === "error" ? "#ef4444" :
                         statusChipProps.color === "success" ? "#22c55e" : "#3b82f6",
                color: "white",
                fontWeight: 600,
                px: 2
              }}
            />
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {/* 검사 영상 섹션 */}
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <PlayCircleOutline color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  검사 영상
                </Typography>
              </Stack>
              <Box
                sx={{
                  width: "100%",
                  height: 300,
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  border: "2px dashed #cbd5e1",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#e2e8f0",
                    borderColor: "#94a3b8"
                  }
                }}
              >
                <Stack alignItems="center" spacing={1}>
                  <PlayCircleOutline sx={{ fontSize: 48, color: "#64748b" }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    검사 영상을 불러오는 중...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    검사 ID: {inspectionData.inspectionId}
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI 리포트 섹션 */}
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <SmartToy color="secondary" />
                <Typography variant="h6" fontWeight={600}>
                  AI 분석 리포트
                </Typography>
              </Stack>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: inspectionData.status === "불량" ? "#fef7f0" : "#f0fdf4",
                  borderRadius: 2,
                  border: `1px solid ${inspectionData.status === "불량" ? "#fed7aa" : "#bbf7d0"}`
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.6,
                    fontWeight: 500,
                    color: inspectionData.status === "불량" ? "#ea580c" : "#16a34a"
                  }}
                >
                  {inspectionData.status === "불량" ? "🚨" : "✅"} {inspectionData.part} 검사 결과
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={1}
                  sx={{ lineHeight: 1.5 }}
                >
                  {inspectionData.status === "불량"
                    ? `${inspectionData.part}에서 문제가 감지되었습니다. 상세한 조치가 필요합니다.`
                    : `${inspectionData.part} 검사가 정상적으로 완료되었습니다.`
                  }
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 작업자 정보 섹션 */}
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <PersonOutline color="info" />
                <Typography variant="h6" fontWeight={600}>
                  작업자 정보
                </Typography>
              </Stack>
              <Stack spacing={2.5}>
                <TextField
                  label="담당 작업자"
                  fullWidth
                  size="small"
                  value={inspectionData.worker || "-"}
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f8fafc"
                    }
                  }}
                />
                <TextField
                  label="조치 시작 시간"
                  fullWidth
                  size="small"
                  value={formatDateTime(inspectionData.startTime)}
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f8fafc"
                    }
                  }}
                />
                <TextField
                  label="조치 완료 시간"
                  fullWidth
                  size="small"
                  value={formatDateTime(inspectionData.endTime)}
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f8fafc"
                    }
                  }}
                />
                <TextField
                  label="작업 소요 시간"
                  fullWidth
                  size="small"
                  value={workDuration}
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f8fafc"
                    }
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 조치 내용 섹션 */}
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <Assignment color="success" />
                <Typography variant="h6" fontWeight={600}>
                  조치 내용
                </Typography>
              </Stack>
              <TextField
                multiline
                rows={8}
                fullWidth
                value={inspectionData.actionDetails || "조치 내용이 기록되지 않았습니다."}
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc"
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 하단 정보 - 관리자용 */}
      <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
        <Button
          variant="outlined"
          size="large"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600
          }}
        >
          목록으로 돌아가기
        </Button>

        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label={statusChipProps.label}
            color={statusChipProps.color}
            sx={{
              px: 2,
              py: 1,
              fontWeight: 600,
              fontSize: "0.875rem",
              bgcolor: statusChipProps.color === "error" ? "#ef4444" :
                       statusChipProps.color === "success" ? "#22c55e" : "#3b82f6",
              color: "white"
            }}
          />
          <Typography variant="body2" color="text.secondary">
            최종 업데이트: {formatDateTime(inspectionData.endTime) || formatDateTime(inspectionData.startTime)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default InspectionDetail;