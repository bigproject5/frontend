import React, { useEffect, useState } from "react";
import { fetch_inspection_detail } from "../api/vehicleAuditApi";
import "./workerpartdetail.css";

const inspectionTypeKor = {
  PAINT: "도장면",
  LAMP: "전조등",
  WIPER: "와이퍼",
  ENGINE: "엔진",
  EM_WAVE: "전자파",
  WASHER_FLUID: "워셔액"
};

export default function Workerpartdetail({ inspectionId }) {
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetch_inspection_detail(inspectionId)
      .then(res => setDetail(res.data))
      .catch(err => console.error(err));
  }, [inspectionId]);

  if (!detail) return <div>로딩중...</div>;

  return (
    <main className="worker-main-area">
      <div className="worker-title-row">
        <span className="worker-title">
          <b>{inspectionTypeKor[detail.inspectionType] || detail.inspectionType}</b> 검사
        </span>
        <span className="worker-status">{detail.status}</span>
      </div>
      <div className="worker-upper">
        <div className="worker-video-block">
          <div className="worker-video-area">
            <div className="worker-video-play">
              {/* 비디오/이미지/플레이스홀더 */}
              <span className="video-play-icon">&#9654;</span>
            </div>
          </div>
          <div className="video-id-label">
            데이터 경로: {detail.collectDataPath || "-"}
          </div>
        </div>
        <div className="worker-report-block">
          <div className="worker-report-title">
            <b>AI 리포트(조치 제안)</b>
          </div>
          <div className="worker-report-content">
            <div className="worker-report-section">
              <div className="report-subtitle">AI 분석 결과</div>
              <div className="report-desc">
                {detail.isDefect
                  ? "불량이 감지되었습니다."
                  : "정상 작동 중입니다."}
              </div>
            </div>
            <div className="worker-report-section">
              <div className="report-subtitle">AI 권장 조치</div>
              <div className="worker-report-badges">
                {detail.aiSuggestion
                  ? detail.aiSuggestion
                  : detail.isDefect
                  ? "정비 필요"
                  : "정상"}
              </div>
            </div>
            <div className="worker-report-info">
              <div>진단상태: {detail.status}</div>
            </div>
          </div>
        </div>
      </div>
      {/* 하단 작업자 입력/조치란 등은 별도 구현 */}
    </main>
  );
}
