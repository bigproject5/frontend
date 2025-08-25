const API_BASE_URL = 'http://localhost:8080/api/vehicleaudit';
const NOTICE_API_BASE_URL = 'http://localhost:8080/api/operation';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * 검사 목록 조회 API
 * @param {Object} params - 조회 파라미터
 * @param {string} params.status - 검사 상태 (ABNORMAL, IN_ACTION, COMPLETED)
 * @param {number} params.page - 페이지 번호 (0부터 시작)
 * @param {number} params.size - 페이지 크기 (기본값: 10)
 * @param {Object} params.user - Redux에서 가져온 사용자 정보 (taskType 포함)
 * @param {string} params.taskType - 검사 유형
 * @returns {Promise} API 응답
 */
export const getInspections = async (params = {}) => {
  try {
    const { status, page = 0, size = 10, user, taskType } = params;

    // 사용자 정보 확인
    console.log('user:', user);
    console.log('taskType:', taskType);

    if (!user) {
      throw new Error('사용자 인증 정보가 없습니다.');
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    // taskType이 있을 때만 inspectionType 파라미터 추가
    if (taskType && taskType !== 'ALL') {
      queryParams.append('inspectionType', taskType);
    }

    // status가 제공된 경우에만 추가
    if (status) {
      queryParams.append('status', status);
    }

    const url = `${API_BASE_URL}/inspections?${queryParams.toString()}`;

    console.log('API 호출 URL:', url);
    console.log('API 호출 파라미터:', queryParams.toString());

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API 응답:', data);
    return data;
  } catch (error) {
    console.error('검사 목록 조회 실패:', error);
    // 에러를 다시 던져서 상위 컴포넌트에서 처리하도록 함
    throw error;
  }
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
      headers: getAuthHeaders(),
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

/**
 * 수동 테스트 생성 API
 * @param {Object} auditData - { model: string, lineCode: string }
 * @param {Object} files - { PAINT: File, LAMP: File, ... }
 * @returns {Promise} API 응답
 */
export const createManualAudit = async (auditData, files) => {
  try {
    const formData = new FormData();

    const auditJsonString = JSON.stringify(auditData);
    formData.append('audit', auditJsonString);

    // 각 검사 유형별 파일 추가
    Object.entries(files).forEach(([inspectionType, file]) => {
      if (file) {
        formData.append(inspectionType, file);
      }
    });

    console.log('수동 테스트 생성 API 호출');
    console.log('=== Audit 데이터 상세 ===');
    console.log('auditData 객체:', auditData);
    console.log('auditData JSON 문자열:', auditJsonString);
    console.log('auditData 타입:', typeof auditData);
    console.log('auditData 키 목록:', Object.keys(auditData));
    console.log('model 값:', auditData.model);
    console.log('lineCode 값:', auditData.lineCode);
    console.log('파일 목록:', Object.keys(files));

    // FormData에 추가된 파트명들 확인
    console.log('=== FormData 파트명 확인 ===');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`파트명: ${key}, 파일명: ${value.name}, 타입: ${value.type}, 크기: ${value.size}bytes`);
      } else {
        console.log(`파트명: ${key}, 값: ${value}, 타입: ${typeof value}`);
      }
    }
    console.log('========================');

    const token = sessionStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/audits/manual`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
      // FormData 사용 시 헤더를 명시적으로 설정하지 않음
      // 브라우저가 자동으로 multipart/form-data와 boundary를 설정
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 응답 오류:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('수동 테스트 생성 성공:', data);
    return data;
  } catch (error) {
    console.error('수동 테스트 생성 실패:', error);
    throw error;
  }
};
