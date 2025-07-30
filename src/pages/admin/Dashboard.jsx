import React, { useState } from "react";
import DefectRateChart from '../../components/DefectRateChart.jsx';
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
  Avatar,
  Stack,
  IconButton,
  InputAdornment,
  Badge,
} from "@mui/material";
import {
  Search,
  FilterList,
  TrendingUp,
  DirectionsCar,
  CheckCircle,
  Error,
  PlayCircleOutline,
  CalendarToday,
  Build,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

// 예시 데이터
const inspectionData = [
  { id: 1, carId: "23HY001", part: "도장면", result: "정상", date: "2025-07-30", time: "14:25:08" },
  { id: 2, carId: "23HY002", part: "전조등", result: "불량", date: "2025-07-30", time: "13:45:22" },
  { id: 3, carId: "23HY003", part: "엔진 소리", result: "정상", date: "2025-07-30", time: "12:30:15" },
  { id: 4, carId: "23HY004", part: "와이퍼", result: "정상", date: "2025-07-29", time: "16:20:33" },
  { id: 5, carId: "23HY005", part: "도장면", result: "불량", date: "2025-07-28", time: "15:10:45" },
  { id: 6, carId: "23HY006", part: "전조등", result: "정상", date: "2025-07-28", time: "11:55:12" },
  { id: 7, carId: "23HY007", part: "와이퍼", result: "정상", date: "2025-07-28", time: "09:35:28" },
  { id: 8, carId: "23HY008", part: "도장면", result: "정상", date: "2025-07-27", time: "14:15:56" },
];

const ITEMS_PER_PAGE = 5;

const resultConfig = {
  정상: {
    color: "#22c55e",
    bgColor: "#f0fdf4",
    icon: CheckCircle,
  },
  불량: {
    color: "#ef4444",
    bgColor: "#fef2f2",
    icon: Error,
  },
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
  const [resultFilter, setResultFilter] = useState("");
  const [page, setPage] = useState(1);

  // 통계 계산
  const totalInspections = inspectionData.length;
  const defectCount = inspectionData.filter(item => item.result === "불량").length;
  const defectRate = ((defectCount / totalInspections) * 100).toFixed(1);
  const todayInspections = inspectionData.filter(item => item.date === "2025-07-30").length;

  // 검색 + 필터링 + 정렬
  const filteredData = inspectionData.filter(
    (item) =>
      (item.carId.includes(searchTerm) || item.part.includes(searchTerm)) &&
      (resultFilter === "" || item.result === resultFilter)
  );

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortOption) {
      case "date-desc":
        return new Date(b.date) - new Date(a.date);
      case "date-asc":
        return new Date(a.date) - new Date(b.date);
      case "carId-asc":
        return a.carId.localeCompare(b.carId);
      case "carId-desc":
        return b.carId.localeCompare(a.carId);
      default:
        return 0;
    }
  });

  const paginatedData = sortedData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const pageCount = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const getResultChip = (result) => {
    const config = resultConfig[result];
    const IconComponent = config.icon;

    return (
      <Chip
        icon={<IconComponent sx={{ fontSize: 16 }} />}
        label={result}
        size="small"
        sx={{
          bgcolor: config.bgColor,
          color: config.color,
          border: `1px solid ${config.color}20`,
          fontWeight: 600,
          "& .MuiChip-icon": {
            color: config.color,
          },
        }}
      />
    );
  };

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", p: 3 }}>
      {/* 헤더 */}
      <Box mb={4}>
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Avatar sx={{ bgcolor: "#3b82f6", width: 48, height: 48 }}>
            <TrendingUp />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={700} color="#1e293b">
              관리자 대시보드
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              실시간 검사 현황 및 통계
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* 통계 카드 */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "#3b82f6", width: 48, height: 48 }}>
                  <DirectionsCar />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="#3b82f6">
                    {totalInspections}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    총 검사 건수
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "#ef4444", width: 48, height: 48 }}>
                  <Error />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="#ef4444">
                    {defectRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    불량률
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "#22c55e", width: 48, height: 48 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="#22c55e">
                    {totalInspections - defectCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    정상 건수
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "#f59e0b", width: 48, height: 48 }}>
                  <CalendarToday />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="#f59e0b">
                    {todayInspections}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    오늘 검사
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 차트 */}
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            불량률 추이
          </Typography>
          <DefectRateChart />
        </CardContent>
      </Card>

      {/* 검사 기록 테이블 */}
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Build color="primary" />
            <Typography variant="h6" fontWeight={600}>
              최근 검사 기록
            </Typography>
            <Badge badgeContent={sortedData.length} color="primary" sx={{ ml: 1 }} />
          </Stack>

          {/* 검색/정렬/필터 */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
            <TextField
              placeholder="차량ID 또는 부품명으로 검색..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>정렬</InputLabel>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                label="정렬"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="date-desc">최신순</MenuItem>
                <MenuItem value="date-asc">오래된순</MenuItem>
                <MenuItem value="carId-asc">차량ID ↑</MenuItem>
                <MenuItem value="carId-desc">차량ID ↓</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>검사결과</InputLabel>
              <Select
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
                label="검사결과"
                sx={{ borderRadius: 2 }}
                displayEmpty
                renderValue={(selected) => selected || "전체"}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value="정상">정상</MenuItem>
                <MenuItem value="불량">불량</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* 테이블 */}
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>차량 ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>검사 항목</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>결과</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>검사일시</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:hover": {
                        bgcolor: "#f8fafc",
                        cursor: "pointer"
                      }
                    }}
                  >
                    <TableCell>
                      <Link
                        to={`/admin/vehicle/${row.carId}`}
                        style={{
                          textDecoration: "none",
                          color: "#3b82f6",
                          fontWeight: 600,
                        }}
                      >
                        {row.carId}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Build sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" fontWeight={500}>
                          {row.part}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {getResultChip(row.result)}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={500}>
                          {row.date}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.time}
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 페이지네이션 */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(e, val) => setPage(val)}
              color="primary"
              size="large"
            />
          </Box>
        </CardContent>
      </Card>

      {/* 최근 검사 영상 */}
      <Card elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <PlayCircleOutline color="secondary" />
            <Typography variant="h6" fontWeight={600}>
              최근 검사 영상
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  elevation={0}
                  sx={{
                    border: "2px dashed #cbd5e1",
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#3b82f6",
                      bgcolor: "#f8fafc"
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <PlayCircleOutline sx={{ fontSize: 40, color: "#64748b", mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      검사 영상 {idx}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      23HY00{idx} - 와이퍼
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;