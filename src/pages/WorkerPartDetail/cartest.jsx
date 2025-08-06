import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar.jsx";
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
  if (status === "DONE") return "part-ok";
  return "part-default";
}

export default function Cartest() {
  const [car, setCar] = useState(null);
  const auditId = "1"; // 실전에서는 useParams() 등으로 받기

  useEffect(() => {
    fetch_audit_detail(auditId)
      .then(res => setCar(res.data))
      .catch(err => console.error(err));
  }, [auditId]);

  if (!car) return <div>로딩중...</div>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: "260px", width: "100%" }}>
        <div className="cartest-container">
          <div className="cartest-header">
            <span className="cartest-title">{car.model} (ID: {car.auditId})</span>
            <span className="cartest-status">{car.status}</span>
          </div>
          <div className="cartest-info">
            <span>라인코드: {car.lineCode}</span>
            <span>검사시각: {car.testAt?.slice(0, 19).replace("T", " ")}</span>
          </div>
          <div className="cartest-grid">
            {car.inspections.map(part => (
              <div
                key={part.inspectionId}
                className={`part-card ${getColor(part.isDefect, part.status)}`}
                // 상세 페이지 이동 추가 가능
              >
                <div className="part-name">{inspectionTypeKor[part.inspectionType] || part.inspectionType}</div>
                <div className="part-status">상태: {part.status}</div>
                <div className="part-defect">{part.isDefect ? "불량발생" : "정상"}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
