const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/taskreports`;

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// 전체 목록 조회
export async function fetchReports(page = 0, size = 10) {
  try {
    const res = await fetch(`${BASE_URL}/reports?page=${page}&size=${size}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("리포트 목록을 불러오지 못했습니다");
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
}

export async function fetchReportDetail(reportId) {
  try{
    const response = await fetch(`${BASE_URL}/reports/${reportId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return response.json();
  }
  catch (err){
    console.error(err);
  }
  return null;
}


// 요약 다시 요청 (GPT 재요약)
export async function resummarizeReport(reportId) {
  try {
    const res = await fetch(`${BASE_URL}/reports/${reportId}/resummarize`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error("요약 재요청 실패");

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error resummarizing report:', error);
    throw error;
  }
}


// 리포트 생성(임시)
export async function createReport(reportData) {
  try {
    const res = await fetch(`${BASE_URL}/reports`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(reportData),
    });

    if (!res.ok) throw new Error("리포트 생성 실패");
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
}


export async function getReportsByWorkerId(accessToken) {
  try {
    const response = await fetch(`${BASE_URL}/worker-reports`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (!response.ok) throw new Error("해당 작업자의 리포트 목록을 불러오지 못했습니다");
    return response.json();
  } catch (error) {
    console.error('Error fetching reports by worker id:', error);
    throw error;
  }
}

export async function getReportsByAdmin(workerId) {
  try {
    const response = await fetch(`${BASE_URL}/worker-reports/${workerId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("해당 작업자의 리포트 목록을 불러오지 못했습니다");
    return response.json();
  } catch (error) {
    console.error('Error fetching reports by admin:', error);
    throw error;
  }
}