import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import NoticeOverview from './NoticeOverview.jsx';
import InspectionSummary from './InspectionSummary.jsx';
import InspectionList from './InspectionList.jsx';
import { getInspections } from '../../api/workerMainApi.js';

const WorkerMainContent = () => {
  const [inspections, setInspections] = useState([]);
  const [allInspections, setAllInspections] = useState([]); // 전체 데이터 저장용
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(null); // 선택된 상태 필터
  const [summaryData, setSummaryData] = useState({
    total: 0,
    inDiagnosis: 0,
    normal: 0,
    abnormal: 0,
    inAction: 0,
    completed: 0
  });

  // Redux에서 사용자 정보 가져오기
  const { user, isAuthenticated, taskType } = useSelector(state => state.auth);

  // 디버깅용 로그 추가
  console.log('WorkerMainContent - Redux 전체 상태:', useSelector(state => state.auth));
  console.log('WorkerMainContent - user:', user);
  console.log('WorkerMainContent - isAuthenticated:', isAuthenticated);
  console.log('WorkerMainContent - taskType:', taskType);

  // 검사 목록 조회
  const fetchInspections = async (page = 0, status = null) => {
    setLoading(true);
    setError(null);

    console.log('fetchInspections 호출 시점의 사용자 정보:');
    console.log('- user:', user);
    console.log('- taskType:', taskType);
    console.log('- isAuthenticated:', isAuthenticated);

    // 사용자 정보가 없으면 에러 처리
    if (!user || !user.taskType) {
      const errorMessage = '사용자 인증 정보가 없거나 taskType이 설정되지 않았습니다.';
      console.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
      return;
    }

    try {
      const params = {
        page,
        size: 10,
        user, // Redux에서 가져온 사용자 정보 전달
        ...(status && { status })
      };

      console.log('API 호출 파라미터:', params);

      const response = await getInspections(params);
      setInspections(response.data?.content || response.content || []);
      setTotalPages(response.data?.totalPages || response.totalPages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('검사 목록 조회 실패:', error);
      setError(error.message || '검사 목록을 불러오는 중 오류가 발생했습니다.');
      setInspections([]);
    } finally {
      setLoading(false);
    }
  };

  // 전체 데이터 조회하여 집계 정보 계산
  const fetchAllInspectionsForSummary = async () => {
    // 사용자 정보가 없으면 실행하지 않음
    if (!user || !user.taskType) {
      console.log('fetchAllInspectionsForSummary: 사용자 정보가 없어서 실행하지 않음');
      return;
    }

    try {
      // 전체 데이터 조회 (페이징 없이)
      const params = {
        page: 0,
        size: 1000, // 충분히 큰 사이즈로 전체 데이터 조회
        user // 사용자 정보 추가
      };

      const response = await getInspections(params);
      const allData = response.data?.content || [];
      setAllInspections(allData);

      // 클라이언트에서 집계 계산 - 5개 상태로 분리
      const summary = {
        total: allData.length,
        inDiagnosis: allData.filter(item => item.status === 'IN_DIAGNOSIS').length,
        normal: allData.filter(item => item.status === 'NORMAL').length,
        abnormal: allData.filter(item => item.status === 'ABNORMAL').length,
        inAction: allData.filter(item => item.status === 'IN_ACTION').length,
        completed: allData.filter(item => item.status === 'COMPLETED').length
      };

      setSummaryData(summary);
    } catch (error) {
      console.error('전체 검사 데이터 조회 실패:', error);
    }
  };

  // 초기 데이터 로드 - 사용자 정보가 있을 때만 실행
  useEffect(() => {
    if (user && user.taskType) {
      fetchInspections();
      fetchAllInspectionsForSummary(); // 집계용 전체 데이터 조회
    } else {
      console.log('사용자 정보가 아직 로드되지 않았습니다.');
    }
  }, [user]); // user 의존성 추가

  // 상태 필터 변경 시 검사 목록 다시 조회 - 각 상태별로 개별 필터링
  const handleStatusFilter = async (status) => {
    setSelectedStatus(status);
    setCurrentPage(0);
    // 모든 상태를 개별적으로 처리
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
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onInspectionClick={handleInspectionClick}
        />
      </Box>
    </Container>
  );
};

export default WorkerMainContent;
