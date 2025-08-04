const API_BASE_URL = '/api/vehicleaudit';
const NOTICE_API_BASE_URL = '/api/operation';

// 가짜 작업자 데이터 (실제로는 Redux에서 관리될 예정)
const MOCK_WORKER = {
  workerId: 1,
  workerName: "김작업자",
  taskType: "PAINT" // PAINT, BODY, ENGINE 등
};

/**
 * 검사 목록 조회 API
 * @param {Object} params - 조회 파라미터
 * @param {string} params.status - 검사 상태 (ABNORMAL, IN_ACTION, COMPLETED)
 * @param {number} params.page - 페이지 번호 (0부터 시작)
 * @param {number} params.size - 페이지 크기 (기본값: 10)
 * @returns {Promise} API 응답
 */
export const getInspections = async (params = {}) => {
  try {
    const { status, page = 0, size = 10, initial = false } = params;

    // 항상 workerId 없이 inspectionType만 필터링
    const queryParams = new URLSearchParams({
      inspectionType: MOCK_WORKER.taskType,
      page: page.toString(),
      size: size.toString()
    });

    // status가 제공된 경우에만 추가
    if (status) {
      queryParams.append('status', status);
    }

    const url = `${API_BASE_URL}/inspections?${queryParams.toString()}`;

    console.log('API 호출 URL:', url);
    console.log('API 호출 파라미터:', { status, page, size, workerId: MOCK_WORKER.workerId, inspectionType: MOCK_WORKER.taskType });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // JWT 토큰이 있다면 Authorization 헤더 추가 (추후 Redux에서 관리)
        // 'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API 응답:', data);
    return data;
  } catch (error) {
    console.error('검사 목록 조회 실패:', error);

    // API 호출 실패 시 목업 데이터로 폴백
    console.log('API 호출 실패로 목업 데이터 사용');
    return getMockData(params);
  }
};

// 목업 데이터 반환 함수 (API 호출 실패 시 폴백용)
const getMockData = (params = {}) => {
  const { status, page = 0, size = 10 } = params;

  // 목업 검사 데이터
  const MOCK_INSPECTIONS = [
    {
      "inspectionId": "1",
      "inspectionType": "PAINT",
      "status": "IN_ACTION",
      "isDefect": false,
      "workerId": 1,
      "workerName": "김작업자",
      "taskStartedAt": "2025-01-30T14:02:09.711515"
    },
    {
      "inspectionId": "2",
      "inspectionType": "PAINT",
      "status": "ABNORMAL",
      "isDefect": true,
      "workerId": 1,
      "workerName": "김작업자",
      "taskStartedAt": "2025-01-30T13:45:22.334521"
    },
    {
      "inspectionId": "3",
      "inspectionType": "PAINT",
      "status": "COMPLETED",
      "isDefect": false,
      "workerId": 1,
      "workerName": "김작업자",
      "taskStartedAt": "2025-01-30T12:30:15.123456"
    },
    {
      "inspectionId": "4",
      "inspectionType": "PAINT",
      "status": "IN_DIAGNOSIS",
      "isDefect": false,
      "workerId": 1,
      "workerName": "김작업자",
      "taskStartedAt": "2025-01-30T11:20:33.789012"
    },
    {
      "inspectionId": "5",
      "inspectionType": "PAINT",
      "status": "COMPLETED",
      "isDefect": false,
      "workerId": 1,
      "workerName": "김작업자",
      "taskStartedAt": "2025-01-30T10:15:44.567890"
    },
    {
      "inspectionId": "6",
      "inspectionType": "PAINT",
      "status": "IN_DIAGNOSIS",
      "isDefect": false,
      "workerId": 1,
      "workerName": "김작업자",
      "taskStartedAt": "2025-01-30T09:30:12.345678"
    }
  ];

  // 실제 API 호출 대신 목업 데이터 처리
  let filteredData = [...MOCK_INSPECTIONS];

  // 상태 필터링
  if (status) {
    filteredData = filteredData.filter(item => item.status === status);
  }

  // 페이징 처리
  const totalElements = filteredData.length;
  const totalPages = Math.ceil(totalElements / size);
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const content = filteredData.slice(startIndex, endIndex);

  // Spring Data JPA Page 형식으로 응답 생성
  return {
    content,
    pageable: {
      sort: { sorted: false, unsorted: true },
      pageNumber: page,
      pageSize: size,
      offset: startIndex,
      paged: true,
      unpaged: false
    },
    totalElements,
    totalPages,
    last: page >= totalPages - 1,
    first: page === 0,
    numberOfElements: content.length,
    size,
    number: page,
    sort: { sorted: false, unsorted: true },
    empty: content.length === 0
  };
};

/**
 * 공지사항 목록 조회 API
 * @param {Object} params - 조회 파라미터
 * @param {number} params.page - 페이지 번호 (0부터 시작)
 * @param {number} params.size - 페이지 크기 (기본값: 5)
 * @returns {Promise} API 응답
 */
export const getNotices = async (params = {}) => {
  try {
    const { page = 0, size = 5 } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    const response = await fetch(`${NOTICE_API_BASE_URL}/notices?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('공지사항 API 응답:', data);

    return {
      data: data,
      status: 'success'
    };
  } catch (error) {
    console.error('공지사항 조회 실패:', error);

    // API 호출 실패 시 목업 데이터로 폴백
    console.log('API 호출 실패로 목업 데이터 사용');
    return getMockNotices(params);
  }
};

// 공지사항 목업 데이터 반환 함수
const getMockNotices = (params = {}) => {
  const { page = 0, size = 5 } = params;

  // 목업 공지사항 데이터
  const MOCK_NOTICES = [
    {
      "id": 1,
      "title": "시스템 점검 안내",
      "adminId": 1,
      "name": "김관리자",
      "fileUrl": null,
      "viewCount": 5,
      "createdAt": "2025-01-10T13:18:58.554331",
      "updatedAt": "2025-01-10T13:18:58.554331"
    },
    {
      "id": 2,
      "title": "검사 프로세스 업데이트",
      "adminId": 2,
      "name": "박매니저",
      "fileUrl": null,
      "viewCount": 12,
      "createdAt": "2025-01-08T09:30:15.123456",
      "updatedAt": "2025-01-08T09:30:15.123456"
    },
    {
      "id": 3,
      "title": "품질관리 교육 완료",
      "adminId": 1,
      "name": "김관리자",
      "fileUrl": null,
      "viewCount": 8,
      "createdAt": "2025-01-05T16:45:30.789012",
      "updatedAt": "2025-01-05T16:45:30.789012"
    },
    {
      "id": 4,
      "title": "새로운 검사 장비 도입",
      "adminId": 3,
      "name": "이팀장",
      "fileUrl": null,
      "viewCount": 15,
      "createdAt": "2025-01-03T14:22:45.321654",
      "updatedAt": "2025-01-03T14:22:45.321654"
    },
    {
      "id": 5,
      "title": "안전 수칙 개정 안내",
      "adminId": 2,
      "name": "박매니저",
      "fileUrl": null,
      "viewCount": 20,
      "createdAt": "2025-01-01T11:15:20.987654",
      "updatedAt": "2025-01-01T11:15:20.987654"
    }
  ];

  // 페이징 처리
  const totalElements = MOCK_NOTICES.length;
  const totalPages = Math.ceil(totalElements / size);
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const content = MOCK_NOTICES.slice(startIndex, endIndex);

  // Spring Data JPA Page 형식으로 응답 생성
  const mockResponse = {
    content,
    pageable: {
      sort: { sorted: false, unsorted: true },
      pageNumber: page,
      pageSize: size,
      offset: startIndex,
      paged: true,
      unpaged: false
    },
    totalElements,
    totalPages,
    last: page >= totalPages - 1,
    first: page === 0,
    numberOfElements: content.length,
    size,
    number: page,
    sort: { sorted: false, unsorted: true },
    empty: content.length === 0
  };

  return {
    data: mockResponse,
    status: 'success'
  };
};

// 작업자 정보 반환 함수 (현재는 목업 데이터, 추후 Redux에서 가져올 예정)
export const getCurrentWorker = () => {
  return MOCK_WORKER;
};
