import React, { useEffect, useState } from "react";
import "./ReportDetail.css";
import { useParams } from "react-router-dom";
import {fetchReportDetail} from "../../api/reportApi.js";

export default function ReportDetail() {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function setReportInfo() {
    try {
      const res = await fetchReportDetail(reportId);
      console.log(res);
      setReport(res.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
      setReportInfo();
  }, [reportId]);

  const handleResummarize = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/taskreports/reports/${reportId}/resummarize`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: report.resolve }),
      });

      if (!res.ok) {
        throw new Error("다시 요약에 실패했습니다.");
      }

      const result = await res.json();
      setReport((prev) => ({
        ...prev,
        summary: result.summary,
      }));
    } catch (err) {
      alert("요약 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="report-container">오류: {error}</div>;
  if (!report) return <div className="report-container">로딩 중...</div>;

  return (
    <div className="report-container">
      <div className="breadcrumb">작업자/관리자 &gt; 불량 레포트 상세</div>
      <h1 className="report-title">불량 레포트 (RPT-{report.reportId})</h1>

      {/* 레포트 기본 정보 */}
      <div className="report-card">
        <h2 className="card-title">레포트 기본 정보</h2>
        
        <table className="report-table">
          <tbody>
            <tr>
              <td className="table-header">레포트번호</td>
              <td>RPT-{report.reportId}</td>
              <td className="table-header">검사 타입</td>
              <td>{report.type}</td>
            </tr>
            <tr>
              <td className="table-header">검사번호</td>
              <td>{report.inspectionId}</td>
              <td className="table-header">담당자 사번</td>
              <td>{report.workerId}</td>
            </tr>
            <tr>
              <td className="table-header">생성일시</td>
              <td colSpan="3">
                {new Date(report.createdAt).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 검사 시간 정보 */}
      {(report.startedAt || report.endedAt) && (
        <div className="report-card">
          <h2 className="card-title">검사 시간 정보</h2>
          
          <table className="report-table">
            <tbody>
              {report.startedAt && report.endedAt && (
                <tr>
                  <td className="table-header">검사 시간</td>
                  <td colSpan="3">
                    {new Date(report.startedAt).toLocaleString('ko-KR')} ~ {new Date(report.endedAt).toLocaleString('ko-KR')}
                    <br />
                    <span className="duration">
                      (소요시간: {Math.round((new Date(report.endedAt) - new Date(report.startedAt)) / 1000 / 60)}분)
                    </span>
                  </td>
                </tr>
              )}
              {report.startedAt && !report.endedAt && (
                <tr>
                  <td className="table-header">시작 시간</td>
                  <td colSpan="3">{new Date(report.startedAt).toLocaleString('ko-KR')}</td>
                </tr>
              )}
              {!report.startedAt && report.endedAt && (
                <tr>
                  <td className="table-header">종료 시간</td>
                  <td colSpan="3">{new Date(report.endedAt).toLocaleString('ko-KR')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 검사 결과 상세 */}
      <div className="report-card">
        <h2 className="card-title">검사 결과 상세</h2>
        
        <table className="report-table">
          <tbody>
            <tr>
              <td className="table-header">상세 내용</td>
              <td className="content-cell">
                {report.resolve}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* AI 분석 결과 */}
      <div className="ai-analysis-card">
        <h2 className="ai-card-title">🤖 AI 분석 결과</h2>
        <div className="ai-content">
          <div className="summary-header">
            <button
              className="resummarize-btn"
              onClick={handleResummarize}
              disabled={loading}
            >
              {loading ? "요약 중..." : "다시 요약"}
            </button>
          </div>
          <div className="ai-summary">
            {report.summary}
          </div>
        </div>
      </div>

      <footer className="footer">ⓒ HYUNDAI</footer>
    </div>
  );
}