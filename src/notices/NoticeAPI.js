//========================================================
// src/notices/NoticeAPI.js
// 백엔드 Operation 시스템의 공지사항 API와 연동하는 파일입니다.
//========================================================

// 공지사항 API의 기본 URL
const API_BASE = "http://localhost:8080/api/operation/notices";

// 헤더 설정 (필요에 따라 변경 가능)
const getCommonHeaders = () => {
  return {
    'X-User-Id': '1', // 예시: 관리자 ID
    'X-User-Name': '관리자' // 예시: 관리자 이름
  };
};

/**
 * 모든 공지사항을 조회합니다.
 * @param {number} [page=0] - 페이지 번호 (0부터 시작)
 * @param {number} [size=10] - 페이지당 항목 수
 */
export async function getNotices(page = 0, size = 10) {
  try {
    const url = new URL(API_BASE);
    url.searchParams.append('page', page);
    url.searchParams.append('size', size);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`공지사항 조회 실패: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('공지사항 조회 중 오류:', error);

    // 백엔드 연동 전까지 임시 데이터 반환
    return [
      {
        id: 1,
        title: "새로운 AI 검사 시스템 도입 안내",
        content: "비전 검사 시스템의 정확도가 향상되었습니다.",
        author: "김관리자",
        department: "전체",
        isPinned: true,
        views: 145,
        createdAt: "2024-01-15 09:00",
        attachments: []
      },
      {
        id: 2,
        title: "정기 점검 일정 안내",
        content: "매월 첫째 주 일요일 정기 점검이 있습니다.",
        author: "이팀장",
        department: "전체",
        isPinned: false,
        views: 89,
        createdAt: "2024-01-14 16:30",
        attachments: []
      },
      {
        id: 3,
        title: "도장 부서 작업 지침 변경",
        content: "도장 검사 프로세스가 일부 변경되었습니다.",
        author: "박팀장",
        department: "도장",
        isPinned: false,
        views: 67,
        createdAt: "2024-01-13 14:20",
        attachments: []
      }
    ];
  }
}

/**
 * 특정 ID의 공지사항 상세 정보를 조회합니다.
 * @param {number} id - 공지사항 ID
 */
export async function getNoticeDetail(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    
    if (!response.ok) {
      throw new Error(`공지사항 상세 조회 실패: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('공지사항 상세 조회 중 오류:', error);
    return null;
  }
}

/**
 * 새로운 공지사항을 생성합니다. (파일 첨부 가능)
 * @param {object} noticeData - { title, content }
 * @param {*[]} [file] - 첨부할 파일 객체 (선택 사항)
 */
export async function createNotice(noticeData, file) {
  try {
    const formData = new FormData();
    // 백엔드 @RequestPart("notice")에 매핑될 JSON 데이터
    formData.append(
      'notice',
      new Blob([JSON.stringify(noticeData)], { type: 'application/json' })
    );
    // 백엔드 @RequestPart("file")에 매핑될 파일
    if (file) {
      formData.append('file', file);
    }

    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: getCommonHeaders(),
      body: formData, // FormData를 사용하면 Content-Type은 자동으로 multipart/form-data로 설정됩니다.
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`공지사항 생성 실패: ${response.status}, ${errorData}`);
    }
    return await response.json();
  } catch (error) {
    console.error('공지사항 생성 중 오류:', error);
    throw error;
  }
}

/**
 * 기존 공지사항을 수정합니다. (파일 첨부 가능)
 * @param {number} id - 공지사항 ID
 * @param {object} noticeData - { title, content }
 * @param {File} [file] - 첨부할 파일 객체 (선택 사항)
 */
export async function updateNotice(id, noticeData, file) {
  try {
    const formData = new FormData();
    formData.append(
      'notice',
      new Blob([JSON.stringify(noticeData)], { type: 'application/json' })
    );
    if (file) {
      formData.append('file', file);
    }
    
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: getCommonHeaders(),
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`공지사항 수정 실패: ${response.status}, ${errorData}`);
    }
    return await response.json();
  } catch (error) {
    console.error('공지사항 수정 중 오류:', error);
    throw error;
  }
}

/**
 * 특정 ID의 공지사항을 삭제합니다.
 * @param {number} id - 공지사항 ID
 */
export async function deleteNotice(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: getCommonHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`공지사항 삭제 실패: ${response.status}`);
    }
    return true; // 삭제 성공
  } catch (error) {
    console.error('공지사항 삭제 중 오류:', error);
    throw error;
  }
}

/**
 * 특정 공지사항의 조회수를 증가시킵니다.
 * @param {number} id - 공지사항 ID
 */
export async function increaseViews(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}/views`, {
      method: 'POST',
      headers: getCommonHeaders(),
    });
    if (!response.ok) {
      throw new Error('조회수 증가 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('조회수 증가 중 오류:', error);
    throw error;
  }
}

// 부서 목록
export const departments = [
  { value: "전체", label: "전체", color: "primary" },
  { value: "도장", label: "도장", color: "success" },
  { value: "패널", label: "패널", color: "info" },
  { value: "엔진", label: "엔진", color: "warning" }
];

// 부서별 색상 가져오기
export const getDepartmentColor = (department) => {
  const dept = departments.find(d => d.value === department);
  return dept ? dept.color : "default";
};