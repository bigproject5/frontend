import React from "react";
import "./workerpartdetail.css";

export default function Workerpartdetail() {
  return (
      <main className="worker-main-area">
        <div className="worker-title-row">
          <span className="worker-title">
            <b>car 0231-123-A</b> / 와이퍼 동작
          </span>
          <span className="worker-status">진행중</span>
        </div>

        <div className="worker-upper">
          <div className="worker-video-block">
            {/* 비디오 or placeholder */}
            <div className="worker-video-area">
              <div className="worker-video-play">
                <span className="video-play-icon">&#9654;</span>
              </div>
            </div>
            <div className="video-id-label">영상 ID: WPR_001_20250718</div>
          </div>
          <div className="worker-report-block">
            <div className="worker-report-title">
              <span className="dot-green"></span>
              <b>AI 리포트(조치 제안)</b>
            </div>
            <div className="worker-report-content">
              <div className="worker-report-section">
                <div className="report-subtitle">분석 결과</div>
                <div className="report-desc">
                  와이퍼 동작 시스템에서 정상적인 작동 패턴이 감지되었습니다. 모든 구성 요소가 표준 사양에 맞게 작동하고 있습니다.
                </div>
              </div>
              <div className="worker-report-section">
                <div className="report-subtitle">권장 조치사항</div>
                <div className="report-badges">
                  <span className="badge-green">정상</span>
                  <span className="badge-blue">정기 점검 권장</span>
                </div>
              </div>
              <div className="worker-report-info">
                <div>분석 시간: 2025-07-18 14:25:08</div>
                <div>신뢰도: 98.5%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="worker-lower">
          <div className="worker-info-block">
            <label>작업자</label>
            <input className="worker-input" placeholder="작업자" />
            <label>조치 시작 시간</label>
            <input className="worker-input" placeholder="조치 시작 시간" />
            <label>조치 완료 시간</label>
            <input className="worker-input" placeholder="조치 완료 시간" />
            <div className="worker-buttons">
              <button className="start-btn">시작</button>
              <button className="finish-btn">완료</button>
            </div>
          </div>
          <div className="worker-action-block">
            <label>작업자 조치 사항 작성란</label>
            <textarea className="worker-textarea" placeholder="작업자 조치 사항을 입력하세요..." />
            <button className="save-btn">저장</button>
          </div>
        </div>
      </main>
  );
}

