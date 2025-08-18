const BASE_URL = "http://localhost:8080/api/taskreports/reports";

// 전체 목록 조회
export async function fetchReports() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("리포트 목록을 불러오지 못했습니다");
  const json = await res.json();
  return json.data.reports;
}

export async function fetchReportDetail(reportId) {
  try{
    const response = await fetch(`${BASE_URL}/${reportId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
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
  const res = await fetch(`${BASE_URL}/${reportId}/resummarize`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("요약 재요청 실패");

  const json = await res.json();
  return json.data;
}


// 리포트 생성(임시)
export async function createReport(reportData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reportData),
  });

  if (!res.ok) throw new Error("리포트 생성 실패");
  const json = await res.json();
  return json.data;
}


export async function getReportsByWorkerId(workerId) {
  const response = await fetch(`${BASE_URL}/worker-reports?${workerId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  return response.json();
}

export async function getReportsByAdmin(workerId) {
  const response = await fetch(`${BASE_URL}/admin/worker-reports/${workerId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  return response.json();
}