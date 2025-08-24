import React from "react";
import {
    Refresh,
    CalendarToday,
    Assessment,
    Description,
    Schedule,
} from '@mui/icons-material';
import "./ReportDashboard.css";
import ReportsList from './ReportList.jsx';

export default function ReportDashboard() {
    const handleRefresh = () => {
        // ReportsList 컴포넌트에서 새로고침 로직을 처리하도록 이벤트 발생
        window.dispatchEvent(new CustomEvent('refreshReports'));
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">
                {/* Header */}
                <div className="page-header">
                    <div className="header-content">
                        <h1 className="page-title">레포트 관리</h1>
                        <p className="page-subtitle">검사 결과 레포트를 확인하고 관리합니다.</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-outline">
                            <CalendarToday className="btn-icon" />
                            기간 필터
                        </button>
                        <button onClick={handleRefresh} className="btn btn-primary">
                            <Refresh className="btn-icon" />
                            새로고침
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-text">
                                <p className="stat-label">전체 레포트</p>
                                <p className="stat-value">0</p>
                            </div>
                            <div className="stat-icon stat-icon-blue">
                                <Assessment className="icon" />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-text">
                                <p className="stat-label">오늘 생성</p>
                                <p className="stat-value">0</p>
                            </div>
                            <div className="stat-icon stat-icon-green">
                                <Description className="icon" />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-text">
                                <p className="stat-label">최근 업데이트</p>
                                <p className="stat-date">-</p>
                            </div>
                            <div className="stat-icon stat-icon-purple">
                                <Schedule className="icon" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reports List Component */}
                <ReportsList />
            </div>
        </div>
    );
}