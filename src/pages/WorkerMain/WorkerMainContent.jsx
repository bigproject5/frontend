import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import NoticeOverview from './NoticeOverview.jsx';
import InspectionSummary from './InspectionSummary.jsx';
import InspectionList from './InspectionList.jsx';
import { getInspections, getCurrentWorker } from '../../api/workerMainApi.js';

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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#002c5f',
          mb: 4
        }}
      >
        작업자 메인
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 공지사항 개요 */}
        <NoticeOverview />

        {/* 검사 집계 */}
        <InspectionSummary
          summaryData={summaryData}
          onStatusFilter={handleStatusFilter}
        />

        {/* 검사 목록 */}
        <InspectionList
          inspections={inspections}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>
    </Container>
  );
};

export default WorkerMainContent;
