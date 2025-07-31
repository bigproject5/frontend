{
  `newText`: `// 공지사항 API 연동
const API_BASE = \"http://localhost:8080/api/notices\";

// 모든 공지사항 조회
export async function getNotices() {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error('공지사항 조회 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('공지사항 조회 중 오류:', error);
    // 임시 데이터 반환 (백엔드 연동 전까지)
    return [
      {
        id: 1,
        title: \"새로운 AI 검사 시스템 도입 안내\",
        content: \"비전 검사 시스템의 정확도가 향상되었습니다.\",
        author: \"김관리자\",
        department: \"전체\",
        isPinned: true,
        views: 145,
        createdAt: \"2024-01-15 09:00\",
        attachments: []
      },
      {
        id: 2,
        title: \"정기 점검 일정 안내\",
        content: \"매월 첫째 주 일요일 정기 점검이 있습니다.\",
        author: \"이팀장\",
        department: \"전체\",
        isPinned: false,
        views: 89,
        createdAt: \"2024-01-14 16:30\",
        attachments: []
      },
      {
        id: 3,
        title: \"도장 부서 작업 지침 변경\",
        content: \"도장 검사 프로세스가 일부 변경되었습니다.\",
        author: \"박팀장\",
        department: \"도장\",
        isPinned: false,
        views: 67,
        createdAt: \"2024-01-13 14:20\",
        attachments: []
      }
    ];
  }
}

// 공지사항 상세 조회
export async function getNoticeDetail(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      throw new Error('공지사항 상세 조회 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('공지사항 상세 조회 중 오류:', error);
    return null;
  }
}

// 공지사항 생성
export async function createNotice(noticeData) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noticeData),
    });
    if (!response.ok) {
      throw new Error('공지사항 생성 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('공지사항 생성 중 오류:', error);
    throw error;
  }
}

// 공지사항 수정
export async function updateNotice(id, noticeData) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noticeData),
    });
    if (!response.ok) {
      throw new Error('공지사항 수정 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('공지사항 수정 중 오류:', error);
    throw error;
  }
}

// 공지사항 삭제
export async function deleteNotice(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('공지사항 삭제 실패');
    }
    return true;
  } catch (error) {
    console.error('공지사항 삭제 중 오류:', error);
    throw error;
  }
}

// 조회수 증가
export async function increaseViews(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}/views`, {
      method: 'POST',
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
  { value: \"전체\", label: \"전체\", color: \"primary\" },
  { value: \"도장\", label: \"도장\", color: \"success\" },
  { value: \"패널\", label: \"패널\", color: \"info\" },
  { value: \"엔진\", label: \"엔진\", color: \"warning\" }
];

// 부서별 색상 가져오기
export const getDepartmentColor = (department) => {
  const dept = departments.find(d => d.value === department);
  return dept ? dept.color : \"default\";
};`,
  `oldText`: `// src/notices/noticeAPI.js
// import axios from \"axios\";
// const API_BASE = \"http://localhost:8080/api/notices\";

export async function getNotices() {
  // 서버 연동 예시
  // const res = await axios.get(API_BASE);
  // return res.data;
  return []; // 임시
}

export async function getNoticeDetail(id) {
  // const res = await axios.get(`${API_BASE}/${id}`);
  // return res.data;
  return null; // 임시
}`,
  `pathInProject`: `src/notices/NoticeAPI.js`
}