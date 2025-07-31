import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchReports } from "../api/reportApi";
import "./ReportDashboard.css";

export default function ReportDashboard() {
  const [reports, setReports] = useState([]);
  const [activeOption, setActiveOption] = useState("일일 레포트 생성");
  const navigate = useNavigate();

  const reportOptions = [
    "일일 레포트 생성",
    "주간 레포트 생성",
    "월간 레포트 생성",
    "사용자 정의 레포트",
  ];

  useEffect(() => {
  const loadReports = async () => {
    try {
      const data = await fetchReports();
      console.log("불러온 데이터 확인:", data);

      setReports(data);
    } catch (error) {
      console.error("리포트 불러오기 실패:", error);
      setReports([]); 
    }
  };
  loadReports();
}, []);

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="title">레포트</h1>
          <p className="subtitle">검사 결과 및 통계 레포트를 관리합니다.</p>
        </div>
        <div className="header-actions">
          <button className="outline-btn">📅 기간 설정</button>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard title="오늘 검사" value="156대" diff="+12 전일 대비" />
        <SummaryCard title="불량 검사" value="12건" diff="-3 전일 대비" />
        <SummaryCard title="합격률" value="92.3%" diff="+1.2% 전일 대비" />
        <SummaryCard title="평균 처리시간" value="2.4시간" diff="-15분 전일 대비" />
      </div>

      <div className="section">
        <h2 className="section-title">레포트 목록</h2>
        <p className="section-desc">생성된 레포트를 확인하고 다운로드할 수 있습니다.</p>

        <table className="table">
          <thead>
            <tr>
              <th>레포트 ID</th>
              <th>사번</th>
              <th>차량 ID</th>
              <th>유형</th>
              <th>생성일</th>
              <th>보기</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <ReportRow
                key={report.reportId}
                id={report.reportId}
                workerId={report.workerId}
                carId={report.carId}
                type={report.type}
                createdAt={report.createdAt}
                navigate={navigate}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid">
        <div className="card">
          <h3 className="card-title">레포트 생성 옵션</h3>
          <p className="section-desc">새 레포트를 생성하거나 자동 생성을 설정합니다.</p>
          {reportOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveOption(option)}
              className={`report-option-btn ${activeOption === option ? "active" : ""}`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="card">
          <h3 className="card-title">자동 생성 설정</h3>
          <p className="section-desc">레포트 자동 생성 스케줄을 관리합니다.</p>
          <ScheduleRow title="일일 레포트" time="매일 18:00 자동 생성" active />
          <ScheduleRow title="주간 레포트" time="매주 월요일 20:00 생성" active />
          <ScheduleRow title="월간 레포트" time="매월 1일 09:00 생성" active={false} />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, diff }) {
  return (
    <div className="summary-card">
      <div className="card-title-sm">{title}</div>
      <div className="card-value">{value}</div>
      <div className={`card-diff ${diff.includes("-") ? "diff-bad" : "diff-good"}`}>{diff}</div>
    </div>
  );
}

function ReportRow({ id, workerId, carId, type, createdAt, navigate }) {
  const handleView = () => {
    navigate(`/reports/${id}`);
  };

  return (
    <tr>
      <td>{id}</td>
      <td>{workerId ?? "-"}</td>
      <td><span className="badge">{carId}</span></td>
      <td>{type ?? "-"}</td>
      <td>{createdAt ? new Date(createdAt).toLocaleDateString() : "-"}</td>
      <td>
        <button className="icon-btn" onClick={handleView}>
          <span className="icon">👁️</span> 보기
        </button>
      </td>
    </tr>
  );
}



function ScheduleRow({ title, time, active }) {
  return (
    <div className="schedule-row">
      <div>
        <div className="schedule-title">{title}</div>
        <div className="schedule-time">{time}</div>
      </div>
      <span className={`tag ${active ? "tag-on" : "tag-off"}`}>
        {active ? "활성" : "비활성"}
      </span>
    </div>
  );
}