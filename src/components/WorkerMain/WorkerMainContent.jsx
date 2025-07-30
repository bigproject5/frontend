import React from 'react';
import { Box } from '@mui/material';
import NoticeOverview from './NoticeOverview.jsx';
import InspectionSummary from './InspectionSummary.jsx';
import InspectionList from './InspectionList.jsx';

const WorkerMainContent = () => {
  return (
    <Box
      sx={{
        padding: '20px',
        background: '#f8f9fa',
        minHeight: '100vh',
        width: '100%',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        boxSizing: 'border-box'
      }}
    >
      {/* 1. 공지사항 & 개요 - 별도 컴포넌트로 분리 */}
      <NoticeOverview />

      {/* 2. 검사 집계 */}
      <InspectionSummary />

      {/* 3. 검사 목록 */}
      <InspectionList />
    </Box>
  );
};

export default WorkerMainContent;
