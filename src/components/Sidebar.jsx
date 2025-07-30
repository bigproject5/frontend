import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Chip,
  Paper,
  Collapse,
  Badge,
} from "@mui/material";
import {
  Dashboard,
  Visibility,
  People,
  Error,
  Build,
  Assignment,
  BarChart,
  Notifications,
  ExpandLess,
  ExpandMore,
  Settings,
  AccountCircle,
} from "@mui/icons-material";
// import hyundaiLogo from "../assets/현대로고.png"; // 로고 이미지 import 제거

const menuItems = [
  {
    title: "대시보드",
    icon: Dashboard,
    path: "/admin/dashboard",
    active: true,
  },
  {
    title: "실시간 모니터링",
    icon: Visibility,
    path: "/admin/monitoring",
    badge: "LIVE",
    badgeColor: "error",
  },
  {
    title: "검사 관리",
    icon: Build,
    path: "/admin/inspection",
    children: [
      { title: "검사 현황", path: "/admin/inspection/status" },
      { title: "검사 이력", path: "/admin/inspection/history" },
      { title: "검사 설정", path: "/admin/inspection/settings" },
    ],
  },
  {
    title: "불량 관리",
    icon: Error,
    path: "/admin/defects",
    badge: "3",
    badgeColor: "warning",
    children: [
      { title: "불량 현황", path: "/admin/defects/status" },
      { title: "불량 분석", path: "/admin/defects/analysis" },
    ],
  },
  {
    title: "작업자 관리",
    icon: People,
    path: "/admin/workers",
  },
  {
    title: "리포트",
    icon: Assignment,
    path: "/admin/reports",
    children: [
      { title: "일간 리포트", path: "/admin/reports/daily" },
      { title: "주간 리포트", path: "/admin/reports/weekly" },
      { title: "월간 리포트", path: "/admin/reports/monthly" },
    ],
  },
  {
    title: "통계 분석",
    icon: BarChart,
    path: "/admin/analytics",
  },
  {
    title: "공지사항",
    icon: Notifications,
    path: "/admin/notices",
    badge: "2",
    badgeColor: "info",
  },
];

function Sidebar() {
  const location = useLocation();
  const [openItems, setOpenItems] = useState({});

  const handleToggle = (title) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (item) => {
    if (item.path && isActive(item.path)) return true;
    if (item.children) {
      return item.children.some(child => isActive(child.path));
    }
    return false;
  };

  const renderMenuItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemActive = isParentActive(item);
    const isOpen = openItems[item.title];

    return (
      <React.Fragment key={item.title}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            component={!hasChildren ? Link : "div"}
            to={!hasChildren ? item.path : undefined}
            onClick={hasChildren ? () => handleToggle(item.title) : undefined}
            sx={{
              minHeight: 48,
              px: 2.5,
              py: 1,
              ml: depth * 2,
              borderRadius: 2,
              mx: 1,
              mb: 0.5,
              bgcolor: isItemActive ? "#e3f2fd" : "transparent",
              color: isItemActive ? "#1976d2" : "#64748b",
              "&:hover": {
                bgcolor: isItemActive ? "#e3f2fd" : "#f1f5f9",
                color: isItemActive ? "#1976d2" : "#334155",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 2,
                justifyContent: 'center',
                color: "inherit",
              }}
            >
              <item.icon sx={{ fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: isItemActive ? 600 : 500,
              }}
            />
            {item.badge && (
              <Chip
                label={item.badge}
                size="small"
                color={item.badgeColor}
                sx={{
                  height: 20,
                  fontSize: 10,
                  fontWeight: 600,
                  mr: hasChildren ? 1 : 0,
                }}
              />
            )}
            {hasChildren && (
              isOpen ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => (
                <ListItem key={child.title} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    component={Link}
                    to={child.path}
                    sx={{
                      minHeight: 40,
                      px: 2.5,
                      py: 0.5,
                      ml: 4,
                      borderRadius: 2,
                      mx: 1,
                      mb: 0.5,
                      bgcolor: isActive(child.path) ? "#e8f5e8" : "transparent",
                      color: isActive(child.path) ? "#2e7d32" : "#64748b",
                      "&:hover": {
                        bgcolor: isActive(child.path) ? "#e8f5e8" : "#f1f5f9",
                        color: isActive(child.path) ? "#2e7d32" : "#334155",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 2,
                        justifyContent: 'center',
                        color: "inherit",
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "currentColor",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={child.title}
                      primaryTypographyProps={{
                        fontSize: 13,
                        fontWeight: isActive(child.path) ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: 280,
        height: "100vh",
        bgcolor: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
        overflowY: "auto",
      }}
    >
      {/* 개선된 헤더 */}
      <Box
        sx={{
          p: 0,
          borderBottom: "1px solid #e2e8f0",
          background: "linear-gradient(135deg, #002c5f 0%, #004494 50%, #0066cc 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 패턴 */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "100%",
            height: "100%",
            background: `
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
          }}
        />

        <Box sx={{ p: 3, position: "relative", zIndex: 1 }}>
          {/* 텍스트만 중앙 정렬 */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "white",
                letterSpacing: "1px",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                fontSize: "1.5rem",
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              HYUNDAI
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: 500,
                fontSize: "0.9rem",
                letterSpacing: "0.5px",
              }}
            >
              Quality Control System
            </Typography>
          </Box>

          {/* 상태 표시기 */}
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#4ade80",
                boxShadow: "0 0 8px rgba(74, 222, 128, 0.6)",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.7 },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            >
              시스템 온라인
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 사용자 정보 */}
      <Box sx={{ p: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "#3b82f6" }}>
              <AccountCircle />
            </Avatar>
            <Box flex={1}>
              <Typography variant="body2" fontWeight={600}>
                관리자
              </Typography>
              <Typography variant="caption" color="text.secondary">
                admin@hyundai.com
              </Typography>
            </Box>
            <Settings sx={{ fontSize: 18, color: "#64748b", cursor: "pointer" }} />
          </Box>
        </Paper>
      </Box>

      {/* 메뉴 리스트 */}
      <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
        <List>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* 하단 정보 */}
      <Box sx={{ p: 2, borderTop: "1px solid #e2e8f0" }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="caption" color="#16a34a" fontWeight={600}>
            시스템 상태: 정상
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
            v2.1.0 | 2025.07.30
          </Typography>
        </Paper>
      </Box>
    </Paper>
  );
}

export default Sidebar;