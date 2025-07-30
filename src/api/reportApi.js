const BASE_URL = "/api/taskreports/reports";

// 전체 목록 조회
export async function fetchReports() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("리포트 목록을 불러오지 못했습니다");
  const json = await res.json();
  return json.data.reports;
}

// 상세 조회
export async function fetchReportDetail(reportId) {
  const res = await fetch(`${BASE_URL}/${reportId}`);
  if (!res.ok) throw new Error("리포트 상세 정보를 불러오지 못했습니다");
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