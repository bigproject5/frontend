import React, { useEffect, useState } from "react";
import { fetch_audit_detail } from "../../api/vehicleAuditApi.jsx";
import "./cartest.css";

const inspectionTypeKor = {
  PAINT: "도장면",
  LAMP: "전조등",
  WIPER: "와이퍼",
  ENGINE: "엔진",
  EM_WAVE: "전자파",
  WASHER_FLUID: "워셔액"
};

function getColor(isDefect, status) {
  if (isDefect) return "part-bad";
  if (status === "IN_PROGRESS" || status === "IN_DIAGNOSIS") return "part-working";
  if (status === "COMPLETED" || status === "DONE") return "part-done";
  return "part-default";
}

export default function Cartest() {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auditId = "1";

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch_audit_detail(auditId)
      .then(res => {
        if (res.code === 'SUCCESS' && res.data) {
          setCar(res.data);
        } else {
          setError('데이터를 불러올 수 없습니다.');
        }
      })
      .catch(err => {
        console.error('API 호출 오류:', err);
        setError('서버 연결에 실패했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [auditId]);

  if (loading) {
    return (
      <div className="cartest-container">
        <div className="loading-state">
          <h3>데이터를 불러오는 중...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cartest-container">
        <div className="error-state">
          <h3>오류 발생</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="cartest-container">
        <div className="empty-state">
          <h3>데이터가 없습니다.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="cartest-container">
      <div className="cartest-header">
        <div className="title-section">
          <h1 className="cartest-title">{car.model}</h1>
          <span className="audit-id">검사 ID: {car.auditId}</span>
        </div>
        <div className="status-badge status-${car.status.toLowerCase()}">
          {car.status === 'IN_PROGRESS' ? '진행중' : car.status}
        </div>
      </div>

      <div className="cartest-info">
        <div className="info-item">
          <span className="info-label">라인코드</span>
          <span className="info-value">{car.lineCode}</span>
        </div>
        <div className="info-item">
          <span className="info-label">검사시각</span>
          <span className="info-value">{car.testAt?.slice(0, 19).replace("T", " ")}</span>
        </div>
      </div>

      <div className="inspections-section">
        <h3 className="section-title">검사 항목</h3>
        <div className="cartest-grid">
          {car.inspections && car.inspections.length > 0 ? (
            car.inspections.map((part, index) => (
              <div
                key={part.inspectionId || index}
                className={`part-card ${getColor(part.isDefect, part.status)}`}
              >
                <div className="part-header">
                  <div className="part-name">{inspectionTypeKor[part.inspectionType] || part.inspectionType}</div>
                  <div className={`status-indicator ${part.isDefect ? 'defect' : 'normal'}`}>
                    {part.isDefect ? "불량" : "정상"}
                  </div>
                </div>
                <div className="part-details">
                  <div className="part-status">
                    상태: {part.status === 'IN_DIAGNOSIS' ? '진단중' : part.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <p>검사 데이터가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
