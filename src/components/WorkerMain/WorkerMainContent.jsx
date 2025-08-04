import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import NoticeOverview from './NoticeOverview';
import InspectionSummary from './InspectionSummary';
import InspectionList from './InspectionList';
import { getInspections, getCurrentWorker } from '../../api/workerMainApi';

// 현대차 스타일 테마 생성 (WorkerMain 전용)
const workerMainTheme = createTheme({
  palette: {
    primary: {
      main: '#002c5f', // 현대차 진한 남색
      light: '#1976d2',
      dark: '#001a3e',
    },
    secondary: {
      main: '#6c757d',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const WorkerMainContent = () => {
  const [inspections, setInspections] = useState([]);
  const [allInspections, setAllInspections] = useState([]); // 전체 데이터 저장용
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(null); // 선택된 상태 필터
  const [summaryData, setSummaryData] = useState({
    total: 0,
    abnormal: 0,
    inAction: 0,
    inDiagnosis: 0,
    completed: 0
  });

  const worker = getCurrentWorker();

  // 검사 목록 조회
  const fetchInspections = async (page = 0, status = null) => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        ...(status && { status })
      };

      const response = await getInspections(params);
      console.log('API 응답 확인:', response);
      setInspections(response.data?.content || []);
      setTotalPages(response.data?.totalPages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('검사 목록 조회 실패:', error);
      setInspections([]);
    } finally {
      setLoading(false);
    }
  };

  // 전체 데이터 조회하여 집계 정보 계산
  const fetchAllInspectionsForSummary = async () => {
    try {
      // 전체 데이터 조회 (페이징 없이)
      const response = await getInspections({ page: 0, size: 1000 });
      const allData = response.data?.content || [];
      setAllInspections(allData);

      // 클라이언트에서 집계 계산
      const summary = {
        total: allData.length,
        abnormal: allData.filter(item => item.status === 'ABNORMAL').length,
        inAction: allData.filter(item => item.status === 'IN_ACTION').length,
        inDiagnosis: allData.filter(item => item.status === 'IN_DIAGNOSIS').length,
        completed: allData.filter(item => item.status === 'COMPLETED').length
      };

      setSummaryData(summary);
    } catch (error) {
      console.error('전체 검사 데이터 조회 실패:', error);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchInspections();
    fetchAllInspectionsForSummary(); // 집계용 전체 데이터 조회
  }, []);

  // 상태 필터 변경 시 검사 목록 다시 조회
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(0);
    fetchInspections(0, status);
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    fetchInspections(newPage, selectedStatus);
  };

  // 검사 아이템 클릭 (상세 페이지로 이동)
  const handleInspectionClick = (inspectionId) => {
    console.log('검사 상세 페이지로 이동:', inspectionId);
    // 추후 라우팅 구현
  };

  return (
    <ThemeProvider theme={workerMainTheme}>
      <CssBaseline />
      <Container maxWidth={false} sx={{ py: 3, px: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: '#002c5f',
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,44,95,0.1)'
          }}
        >
          작업자 메인 - {worker.workerName}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 공지사항 개요 */}
          <NoticeOverview />

          {/* 검사 요약 */}
          <InspectionSummary
            summaryData={summaryData}
            onStatusClick={handleStatusFilter}
            selectedStatus={selectedStatus}
          />

          {/* 검사 목록 */}
          <InspectionList
            inspections={inspections}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onInspectionClick={handleInspectionClick}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default WorkerMainContent;
