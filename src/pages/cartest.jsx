import React from "react";
import "./cartest.css";
import Sidebar from "../components/Sidebar";

const parts = [
  { name: "와이퍼", status: "불량발생", time: "14:25:08" },
  { name: "엔진", status: "이상없음", time: "14:25:08" },
  { name: "전조등", status: "이상없음", time: "14:25:08" },
  { name: "도장면A", status: "이상없음", time: "14:25:08" },
  { name: "후미등", status: "대기", time: "14:28:42" },
  { name: "범퍼", status: "조치완료", time: "14:25:48" },
  { name: "실내등", status: "대기", time: "" },
];

function getColor(status) {
  switch (status) {
    case "불량발생":
      return "part-bad";
    case "조치완료":
      return "part-done";
    case "이상없음":
      return "part-ok";
    default:
      return "part-default";
  }
}

export default function Cartest() {
  return (
    <div style={{ display: "flex" }}>
          <Sidebar />
        <main style={{ marginLeft: "260px", width: "100%" }}>{
    <div className="cartest-container">
      <div className="cartest-header">
        <span className="cartest-title">car 0231-123</span>
      </div>
      <div className="cartest-tab">
        <button className="tab-btn active">상태</button>
        <button className="tab-btn">검사중</button>
      </div>
      <div className="cartest-grid">
        {parts.map((part, idx) => (
          <div key={idx} className={`part-card ${getColor(part.status)}`}>
            <div className="part-name">{part.name}</div>
            <div className="part-time">시간: {part.time}</div>
            <div className="part-worker">작업자: </div>
          </div>
        ))}
      </div>
    </div>
  }
  </main>
    </div>
  );
}
