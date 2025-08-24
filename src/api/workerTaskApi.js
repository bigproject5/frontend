const API_BASE_URL = `${window.API_CONFIG.VITE_API_BASE_URL}/api/vehicleaudit`;

// 세션 스토리지에서 액세스 토큰 가져오기
const getAccessToken = () => {
  return sessionStorage.getItem('accessToken');
};

// 인증 헤더 생성
const getAuthHeaders = () => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * 작업 시작 API
 * @param {number} inspectionId - 검사 ID
 * @returns {Promise} API 응답
 */
export const startTask = async (inspectionId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/inspections/${inspectionId}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: "IN_ACTION"
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('작업 시작 API 호출 실패:', error);
    throw error;
  }
};

/**
 * 작업 완료 API
 * @param {number} inspectionId - 검사 ID
 * @param {string} resolve - 조치 사항
 * @returns {Promise} API 응답
 */
export const completeTask = async (inspectionId, resolve) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/inspections/${inspectionId}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: "COMPLETED",
          resolve: resolve
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('작업 완료 API 호출 실패:', error);
    throw error;
  }
};

/**
 * 조치 사항 저장 API
 * @param {number} inspectionId - 검사 ID
 * @param {string} resolve - 조치 사항
 * @returns {Promise} API 응답
 */
export const saveResolve = async (inspectionId, resolve) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/inspections/${inspectionId}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          resolve: resolve
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('조치 사항 저장 API 호출 실패:', error);
    throw error;
  }
};
