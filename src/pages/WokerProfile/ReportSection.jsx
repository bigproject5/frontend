import React, { useState, useEffect } from 'react';
import './ReportSection.css';
import { Link } from 'react-router-dom';

const ReportSection = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 컴포넌트 마운트 시 보고서 로드
    useEffect(() => {
        loadReports();
    }, []);

    // 보고서 목록 로드
    const loadReports = async () => {
        setIsLoading(true);
        try {
            // const response = await fetch('/api/user/reports');
            // const data = await response.json();

            setReports([
                {
                    id: 1,
                    title: '업무 보고서',
                    date: '2025/07/30',
                    content: '내용1'
                },
                {
                    id: 2,
                    title: '업무 보고서',
                    date: '2025/07/30',
                    content: '내용2'
                },
                {
                    id: 3,
                    title: '업무 보고서',
                    date: '2025/07/30',
                    content: '내용1'
                },
                {
                    id: 4,
                    title: '업무 보고서',
                    date: '2025/07/30',
                    content: '내용2'
                },
                {
                    id: 1,
                    title: '업무 보고서',
                    date: '2025/07/30',
                    content: '내용1'
                },
                {
                    id: 2,
                    title: '업무 보고서',
                    date: '2025/07/30',
                    content: '내용2'
                },
                {
                    id: 3,
                    title: '업무 보고서',
                    date: '2025/07/30',
                    content: '내용1'
                },
                {
                    id: 4,
                    title: '업무 보고서',
                    date: '2025/07/30',
                    content: '내용2'
                },
                {
                    id: 1,
                    title: '업무 보고서',
                    date: '2025/07/30',
                    content: '내용1'
                },
                {
                    id: 2,
                    title: '업무 보고서',
                    date: '2025/07/30',
                    content: '내용2'
                },
                {
                    id: 3,
                    title: '업무 보고서',
                    date: '2025/07/30',
                    content: '내용1'
                },
                {
                    id: 4,
                    title: '업무 보고서',
                    date: '2025/07/30',
                    content: '내용2'
                }
            ]
            );
        } catch (error) {
            console.error('보고서 목록 로드 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        await loadReports();
    };


    return (
        <div className="report-section">
            <div className="report-header">
                <div className="report-header-left">
                    <span className="menu-icon">📋</span>
                    <h3 className="report-title">내 보고서</h3>
                </div>
                <button
                    className={`refresh-button ${isLoading ? 'loading' : ''}`}
                    onClick={handleRefresh}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            새로고침 중...
                        </>
                    ) : (
                        <>
                            🔄 새로고침
                        </>
                    )}
                </button>
            </div>

            <div className="report-list">
                {reports.length === 0 ? (
                    <div className="no-reports">
                        <div className="no-reports-icon">📄</div>
                        <div className="no-reports-text">작성된 보고서가 없습니다.</div>
                    </div>
                ) : (
                    reports.map((report) => (
                        <Link to={`/report/${report.id}`} className="report-link">
                            <div className="report-simple-card">
                                <div className="report-card-title">{report.title}</div>
                                <div className="report-card-date">{report.date}</div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReportSection;