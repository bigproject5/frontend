// src/api/vehicleAuditApi.js

const Base_URL = 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// 차량 단일(상세) 조회 (inspections 포함)
export async function fetch_audit_detail(auditId) {
  const response = await fetch(`${Base_URL}/api/vehicleaudit/audits/${auditId}`, {
    headers: getAuthHeaders()
  });
  return response.json();
}

// 차량의 파트(부품) 검사 목록만 추출
export async function fetch_audit_inspections(auditId) {
  const response = await fetch(`${Base_URL}/api/vehicleaudit/audits/${auditId}`, {
    headers: getAuthHeaders()
  });
  const json = await response.json();
  return json.data.inspections;
}

// 특정 검사 상세 조회
export async function fetch_inspection_detail(inspectionId) {
  const response = await fetch(`${Base_URL}/api/vehicleaudit/inspections/${inspectionId}`, {
    headers: getAuthHeaders()
  });
  return response.json();
}

// 예시: 검사 결과 저장 등 POST 필요시
/*
export async function save_inspection_action(inspectionId, postData) {
  const response = await fetch(`${Base_URL}/api/vehicleaudit/inspections/${inspectionId}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  return response.json();
}
*/
