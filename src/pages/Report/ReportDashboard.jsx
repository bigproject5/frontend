import React, { useState, useEffect, useCallback } from "react";
import {
    Refresh,
    CalendarToday,
    Assessment,
    Description,
    Schedule,
} from '@mui/icons-material';
import "./ReportDashboard.css";
import ReportsList from './ReportList.jsx';
import { fetchReports } from "../../api/reportApi";
import { CircularProgress } from "@mui/material";

export default function ReportDashboard() {
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        lastUpdated: '-',
    });
    const [loading, setLoading] = useState(true);

    const calculateStats = useCallback((reports) => {
        if (!reports || reports.length === 0) {
            setStats({ total: 0, today: 0, lastUpdated: '-' });
            return;
        }

        const today = new Date().toISOString().slice(0, 10);

        const lastUpdatedReport = reports.reduce((latest, report) => {
            return new Date(latest.updatedAt) > new Date(report.updatedAt) ? latest : report;
        });

        setStats({
            total: reports.length,
            today: reports.filter(r => r.createdAt.startsWith(today)).length,
            lastUpdated: new Date(lastUpdatedReport.updatedAt).toLocaleString('ko-KR'),
        });
    }, []);

    const loadReports = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch all reports by setting a large size limit
            const reportData = await fetchReports(0, 1000);
            if (reportData && reportData.content) {
                calculateStats(reportData.content);
            } else {
                calculateStats([]); // Ensure stats are cleared if there's no content
            }
        } catch (error) {
            console.error("Failed to fetch reports for stats:", error);
            calculateStats([]); // Clear stats on error
        } finally {
            setLoading(false);
        }
    }, [calculateStats]);


    useEffect(() => {
        loadReports();
        window.addEventListener('refreshReports', loadReports);

        return () => {
            window.removeEventListener('refreshReports', loadReports);
        }
    }, [loadReports]);

    const handleRefresh = () => {
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
                        <button onClick={handleRefresh} className="btn btn-primary" disabled={loading}>
                            {loading ? <CircularProgress size={20} color="inherit" /> : <Refresh className="btn-icon" />}
                            새로고침
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="stats-grid">
                    <StatCard icon={<Assessment />} label="전체 레포트" value={stats.total} color="blue" />
                    <StatCard icon={<Description />} label="오늘 생성" value={stats.today} color="green" />
                    <StatCard icon={<Schedule />} label="최근 업데이트" value={stats.lastUpdated} color="gray" isDate={true} />
                </div>

                {/* Reports List Component */}
                <ReportsList />
            </div>
        </div>
    );
}

const StatCard = ({ icon, label, value, color, isDate = false }) => {
    return (
        <div className="stat-card">
            <div className="stat-content">
                <div className="stat-text">
                    <p className="stat-label">{label}</p>
                    {isDate ? (
                         <p className="stat-date">{value}</p>
                    ) : (
                        <p className="stat-value">{value}</p>
                    )}
                </div>
                <div className={`stat-icon stat-icon-${color}`}>
                    {React.cloneElement(icon, { className: 'icon' })}
                </div>
            </div>
        </div>
    );
};
