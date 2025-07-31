import React from "react";
import Sidebar from "./Sidebar";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";

const SIDEBAR_WIDTH = 280;

const Layout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 영역 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${SIDEBAR_WIDTH}px`,
          minHeight: "100vh",
          bgcolor: "#f8fafc",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;