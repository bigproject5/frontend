import React from "react";
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

const sampleDetailData = {
  carId: "0231-123",
  type: "승용",
  model: "SONATA",
  line: "A2",
  date: "2025-07-18",
  inspectionCount: 2,
  statusCounts: {
    불량발생: 1,
    조치완료: 1,
    이상없음: 7,
  },
  parts: [
    { name: "와이퍼", time: "14:25:08", worker: "김작업", status: "불량발생", id: "wiper" },
    { name: "엔진", time: "14:25:08", worker: "이정비", status: "이상없음", id: "engine" },
    { name: "전조등", time: "14:25:08", worker: "박엔지", status: "이상없음", id: "headlight" },
    { name: "도장면A", time: "14:25:08", worker: "최페인트", status: "이상없음", id: "paint" },
    { name: "후미등", time: "14:26:42", worker: "정라이트", status: "조치완료", id: "taillight" },
    { name: "범퍼", time: "14:25:48", worker: "유정비", status: "조치완료", id: "bumper" },
    { name: "실내등", time: "14:26:11", worker: "박실내", status: "이상없음", id: "interior" },
  ],
};

const statusConfig = {
  불량발생: {
    color: "#ef4444",
    bgColor: "#fef2f2",
    borderColor: "#fecaca",
    icon: Error,
    label: "불량발생"
  },
  조치완료: {
    color: "#22c55e",
    bgColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    icon: CheckCircle,
    label: "조치완료"
  },
  이상없음: {
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
  const data = sampleDetailData;

  const handlePartClick = (partId) => {
    navigate(`/admin/inspection/${carId}-${partId}`);
  };

  const getStatusIcon = (status) => {
    const IconComponent = statusConfig[status]?.icon || CheckCircle;
    return <IconComponent sx={{ color: statusConfig[status]?.color, fontSize: 20 }} />;
  };

  const totalParts = data.parts.length;
  const completionRate = Math.round(((totalParts - data.statusCounts.불량발생) / totalParts) * 100);

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
                  <Typography variant="body2" fontWeight={600}>{data.carId}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">분류</Typography>
                  <Typography variant="body2" fontWeight={600}>{data.type}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">모델</Typography>
                  <Typography variant="body2" fontWeight={600}>{data.model}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">작업라인</Typography>
                  <Typography variant="body2" fontWeight={600}>{data.line}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">검사일자</Typography>
                  <Typography variant="body2" fontWeight={600}>{data.date}</Typography>
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
                {Object.entries(data.statusCounts).map(([status, count]) => (
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
                          bgcolor: statusConfig[status]?.color,
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

          <Grid container spacing={2}>
            {data.parts.map((part, idx) => {
              const config = statusConfig[part.status];
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
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
                    onClick={() => handlePartClick(part.id)}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {part.name}
                        </Typography>
                        <IconButton size="small" sx={{ bgcolor: "rgba(255,255,255,0.8)" }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Stack>

                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Schedule sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            {part.time || "-"}
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default Detail;