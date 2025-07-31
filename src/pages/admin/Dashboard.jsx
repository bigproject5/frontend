import React, { useState, useEffect } from "react";
import axios from "axios";
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
  CircularProgress,
  Alert,
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

const ITEMS_PER_PAGE = 5;
const API_BASE_URL = "http://localhost:8080/api/vehicleaudit";

const resultConfig = {
  "이상없음": {
    color: "#22c55e",
    bgColor: "#f0fdf4",
    icon: CheckCircle,
  },
  "불량": {
    color: "#ef4444",
    bgColor: "#fef2f2",
    icon: Error,
  },
};

const Dashboard = () => {
  const [inspectionData, setInspectionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
  const [resultFilter, setResultFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchInspectionsList = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:8080/api/vehicleaudit/audits/1/inspections`);

      setInspectionData(response.data.data || []);
    } catch (err) {
      console.error("검사 목록 조회 실패:", err);
      setError(err.response?.data?.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspectionsList();
  }, []);

  const totalInspections = inspectionData.length;
  const defectCount = inspectionData.filter(item => item.status === "불량").length;
  const defectRate = totalInspections > 0 ? ((defectCount / totalInspections) * 100).toFixed(1) : 0;
  const todayInspections = inspectionData.filter(item =>
    item.inspectionDate === new Date().toISOString().split('T')[0]
  ).length;

  const filteredData = inspectionData.filter(
    (item) =>
      (item.vehicleId?.includes(searchTerm) || item.model?.includes(searchTerm)) &&
      (resultFilter === "" || item.status === resultFilter)
  );

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortOption) {
      case "date-desc":
        return new Date(b.inspectionDate) - new Date(a.inspectionDate);
      case "date-asc":
        return new Date(a.inspectionDate) - new Date(b.inspectionDate);
      case "vehicleId-asc":
        return a.vehicleId?.localeCompare(b.vehicleId);
      case "vehicleId-desc":
        return b.vehicleId?.localeCompare(a.vehicleId);
      default:
        return 0;
    }
  });

  const paginatedData = sortedData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const pageCount = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const getResultChip = (result) => {
    const config = resultConfig[result] || resultConfig["이상없음"];
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

  return (
    <Box>
      {/* 기존 UI 구성 생략 */}
    </Box>
  );
};

export default Dashboard;
