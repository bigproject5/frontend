import React, { useEffect, useState } from "react";
import "./ReportDetail.css";
import { useParams } from "react-router-dom";
import { fetchReports } from "../api/reportApi";


export default function ReportDetail() {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReportDetail() {
      try {
        const res = await fetch(`/api/taskreports/reports/${reportId}`);
        if (!res.ok) {
          throw new Error("리포트를 불러오지 못했습니다.");
        }
        const result = await res.json();
        setReport(result.data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchReportDetail();
  }, [reportId]);

  if (error) return <div className="report-container">오류: {error}</div>;
  if (!report) return <div className="report-container">로딩 중...</div>;

  return (
    <div className="report-container">
      <div className="breadcrumb">작업자/관리자 &gt; 불량 레포트 상세</div>
      <h1 className="report-title">불량 레포트 (RPT-{report.reportId})</h1>

      <div className="meta-grid">
        <div><strong>생성일시:</strong> {new Date(report.createdAt).toLocaleString()}</div>
        <div><strong>검사 담당자 사번:</strong> {report.workerId}</div>
        <div><strong>검사 번호:</strong> {report.inspectionId}</div>
        <div><strong>검사 차량:</strong> {report.carId}</div>
        <div><strong>상태:</strong> {report.status}</div>
      </div>

      <div className="report-section">
        <h2 className="section-title">📋 검사 결과</h2>
        <div className="memo-box">{report.content}</div>
      </div>

      <div className="report-section">
        <h2 className="section-title">📝 요약</h2>
        <div className="memo-box">{report.summary}</div>
      </div>

      <footer className="footer">ⓒ HYUNDAI</footer>
    </div>
  );
}
