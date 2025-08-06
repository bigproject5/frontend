//========================================================
// src/notices/NoticeAPI.js
// 백엔드 Operation 시스템의 공지사항 API와 연동하는 파일입니다.
//========================================================

// 공지사항 API의 기본 URL
const API_BASE = "http://localhost:8080/api/operation/notices";

// Bearer 토큰 헤더 설정 (멀티파트용)
const getAuthHeadersForMultipart = () => {
  const token = sessionStorage.getItem('accessToken');
  console.log('현재 토큰:', token);

  return {
    'Authorization': `Bearer ${token}`
    // Content-Type은 FormData 사용시 브라우저가 자동으로 설정하므로 제외
    // X-User-Id, X-User-Name은 Gateway에서 토큰 인증 후 자동으로 설정됨
  };
};

// JSON 요청용 헤더 설정
const getAuthHeadersForJSON = () => {
  const token = sessionStorage.getItem('accessToken');
  console.log('현재 토큰:', token);
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
    // X-User-Id, X-User-Name은 Gateway에서 토큰 인증 후 자동으로 설정됨
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
    throw error; // 모킹 데이터 대신 오류를 던져서 실제 API 문제를 확인할 수 있도록 함
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
    throw error; // null 반환 대신 에러를 던져서 NoticeDetail에서 에러 처리할 수 있도록 함
  }
}

/**
 * 새로운 공지사항을 생성합니다. (파일 첨부 가능)
 * @param {object} noticeData - { title, content, fileUrl }
 * @param {File} [file] - 첨부할 파일 객체 (선택 사항)
 */
export async function createNotice(noticeData, file) {
  try {
    const formData = new FormData();

    // @RequestPart("notice")에 매핑될 JSON 데이터
    formData.append(
      'notice',
      new Blob([JSON.stringify(noticeData)], { type: 'application/json' })
    );

    // @RequestPart("file")에 매핑될 파일
    if (file) {
      formData.append('file', file);
    } else {
      // 파일이 없는 경우 빈 파일을 제대로 생성
      const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });
      formData.append('file', emptyFile);
    }

    console.log('FormData 내용 확인:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }

    const token = sessionStorage.getItem('accessToken');
    console.log('현재 토큰:', token);

    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Content-Type은 FormData 사용시 브라우저가 자동 설정하므로 제외
        // 다른 헤더도 제외하여 브라우저가 multipart 경계를 올바르게 설정하도록 함
      },
      body: formData
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
 * 기존 공지사항을 수정합니다.
 * @param {number} id - 공지사항 ID
 * @param {object} noticeData - { title, content, fileUrl }
 */
export async function updateNotice(id, noticeData) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: getAuthHeadersForJSON(),
      body: JSON.stringify(noticeData)
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
      headers: getAuthHeadersForJSON(),
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
      headers: getAuthHeadersForJSON(),
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