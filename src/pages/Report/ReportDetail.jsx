import React, { useEffect, useState } from "react";
import "./ReportDetail.css";
import { useParams } from "react-router-dom";
import { fetchReportDetail, resummarizeReport } from "../../api/reportApi.js";
import ReactMarkdown from 'react-markdown';

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
      const result = await resummarizeReport(reportId);
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

  // 미디어 파일 확장자 확인 함수
  const getMediaType = (filePath) => {
    if (!filePath) return null;
    const extension = filePath.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov'];

    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';
    return 'unknown';
  };

  if (error) return <div className="report-container"><div className="error-container">오류: {error}</div></div>;
  if (!report) return <div className="report-container"><div className="loading-container">로딩 중...</div></div>;

  return (
    <div className="report-container">
      <div className="breadcrumb">작업자/관리자 &gt; 불량 레포트 상세</div>
      <h1 className="report-title">불량 레포트 (RPT-{report.reportId})</h1>

      {/* 레포트 기본 정보 */}
      <div className="report-card">
        <h2 className="card-title">📋 레포트 기본 정보</h2>
        
        <table className="report-table">
          <tbody>
            <tr>
              <td className="table-header">레포트번호</td>
              <td className="content-cell">RPT-{report.reportId}</td>
              <td className="table-header">검사 타입</td>
              <td className="content-cell">{report.type}</td>
            </tr>
            <tr>
              <td className="table-header">검사번호</td>
              <td className="content-cell">{report.inspectionId}</td>
              <td className="table-header">담당자 사번</td>
              <td className="content-cell">{report.workerId}</td>
            </tr>
            <tr>
              <td className="table-header">담당자 이름</td>
              <td className="content-cell">{report.workerName || '정보 없음'}</td>
              <td className="table-header">검사결과</td>
              <td className="content-cell">{report.diagnosisResult || '정보 없음'}</td>
            </tr>
            <tr>
              <td className="table-header">생성일시</td>
              <td className="content-cell">
                {new Date(report.createdAt).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </td>
              <td className="table-header">검사 시간</td>
              <td className="content-cell">
                {report.startedAt && report.endedAt ? (
                  <>
                    {new Date(report.startedAt).toLocaleString('ko-KR')} ~ {new Date(report.endedAt).toLocaleString('ko-KR')}
                    <span className="duration">
                      (소요시간: {Math.round((new Date(report.endedAt) - new Date(report.startedAt)) / 1000 / 60)}분)
                    </span>
                  </>
                ) : report.startedAt ? (
                  `시작: ${new Date(report.startedAt).toLocaleString('ko-KR')}`
                ) : report.endedAt ? (
                  `종료: ${new Date(report.endedAt).toLocaleString('ko-KR')}`
                ) : (
                  '정보 없음'
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    

      {/* 검사 결과 상세 */}
      <div className="report-card">
        <h2 className="card-title">🔍 검사 결과 상세</h2>
        
        <table className="report-table">
          <tbody>
            {/* 결과 데이터 사진/영상 */}
            {report.resultDataPath && (
              <tr>
                <td className="table-header">결과 데이터</td>
                <td className="content-cell">
                  {getMediaType(report.resultDataPath) === 'image' && (
                    <>
                      <img
                        src={report.resultDataPath}
                        alt="검사 결과 이미지"
                        className="result-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div style={{display: 'none', color: '#ef4444', padding: '16px', textAlign: 'center', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca'}}>
                        ⚠️ 이미지를 불러올 수 없습니다: {report.resultDataPath}
                      </div>
                    </>
                  )}

                  {getMediaType(report.resultDataPath) === 'video' && (
                    <>
                      <video
                        src={report.resultDataPath}
                        className="result-video"
                        controls
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      >
                        브라우저에서 이 비디오 형식을 지원하지 않습니다.
                      </video>
                      <div style={{display: 'none', color: '#ef4444', padding: '16px', textAlign: 'center', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca'}}>
                        ⚠️ 영상을 불러올 수 없습니다: {report.resultDataPath}
                      </div>
                    </>
                  )}

                  {getMediaType(report.resultDataPath) === 'unknown' && (
                    <div style={{color: '#6b7280', padding: '16px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                      📄 지원하지 않는 파일 형식입니다: {report.resultDataPath}
                    </div>
                  )}
                </td>
              </tr>
            )}
            
            {/* AI 조치 제안 */}
            {report.aiSuggestion && (
              <tr>
                <td className="table-header">AI 조치 제안</td>
                <td className="content-cell">
                  <div className="ai-suggestion-box">
                    💡 {report.aiSuggestion}
                  </div>
                </td>
              </tr>
            )}
            
            {/* 작업자 조치 내용 */}
            <tr>
              <td className="table-header">작업자 조치내용</td>
              <td className="content-cell">
                {/* 원본 내용이 있으면 원본을, 없으면 정제된 내용을 표시 */}
                <div>
                  <div className="worker-input-box">
                    {report.rawContent || report.resolve}
                  </div>
                </div>
                
                {/* 원본과 정제된 내용이 다른 경우에만 정제된 내용 표시 */}
                {report.rawContent && report.resolve && report.rawContent !== report.resolve && (
                  <div style={{marginTop: '16px'}}>
                    <strong style={{color: '#374151'}}>✨ 정제된 내용:</strong>
                    <div className="refined-content-box">
                      {report.resolve}
                    </div>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* AI 생성 보고서 (요약) */}
      {report.summary && (
        <div className="ai-analysis-card">
          <h2 className="ai-card-title">🤖 AI 생성 보고서</h2>
          <div className="ai-content">
            <div className="summary-header">
              <button
                className="resummarize-btn"
                onClick={handleResummarize}
                disabled={loading}
              >
                {loading ? "🔄 생성 중..." : "🔄 다시 생성"}
              </button>
            </div>
            <div className="ai-summary">
              <ReactMarkdown>{report.summary}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">ⓒ 2025 HYUNDAI - All Rights Reserved</footer>
    </div>
  );
}