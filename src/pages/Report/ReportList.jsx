import React, { useState, useEffect } from "react";
import {
    Description,
    ChevronLeft,
    ChevronRight,
} from '@mui/icons-material';
import { fetchReports } from "../../api/reportApi.js";
import { useNavigate } from "react-router-dom";
import {Pagination, Box} from "@mui/material";
import "./ReportList.css";

function ReportRow({ report, onView }) {
    const navigate = useNavigate();

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const getTypeInfo = (type) => {
        const types = {
            'WIPER': { className: 'type-badge-blue', name: '와이퍼' },
            'WASHER_FLUID': { className: 'type-badge-green', name: '워셔액' },
            'PAINT': { className: 'type-badge-red', name: '도장면' },
            'LAMP': { className: 'type-badge-yellow', name: '전조등' },
        };
        return types[type] || { className: 'type-badge-gray', name: type };
    };

    const typeInfo = getTypeInfo(report.type);

    const handleClick = (reportId) => {
        navigate(`/reports/${reportId}`);
    }

    return (
        <tr className="reports-table-row" key={report.reportId} onClick={() => handleClick(report.reportId)}>
            <td className="reports-table-cell">
                <div className="report-id-container">
                    <div className="report-status-dot"></div>
                    <span className="report-id-text">#{report.reportId}</span>
                </div>
            </td>
            <td className="reports-table-cell">
                <div className="report-worker-info">
                    <span className="report-worker-name">{report.workerName || "-"}</span>
                </div>
            </td>
            <td className="reports-table-cell">
                <span className="report-audit-badge">{report.auditId}</span>
            </td>
            <td className="reports-table-cell">
                <span className={`report-type-badge ${typeInfo.className}`}>
                  {typeInfo.name}
                </span>
            </td>
            <td className="reports-table-cell">
                <span className="report-date-text">
                  {report.createdAt ? formatDateTime(report.createdAt) : "-"}
                </span>
            </td>
        </tr>
    );
}

export default function ReportsList() {
    const [reports, setReports] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);
    const [loading, setLoading] = useState(true);

    const loadReports = async () => {
        try {
            setLoading(true);
            const response = await fetchReports(page - 1, pageSize);

            if (response) {
                setReports(response.content || []);
                setTotalElements(response.totalElements);
                setTotalPages(response.totalPages);
            } else {
                console.error("API 응답 오류:", response);
                setReports([]);
                setTotalElements(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("리포트 불러오기 실패:", error);
            setReports([]);
            setTotalElements(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, [page]);

    const handleViewReport = (reportId) => {
        console.log(`레포트 ${reportId} 보기`);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // 현재 페이지 범위 계산
    const getDisplayRange = () => {
        if (totalElements === 0) return { start: 0, end: 0 };
        const start = (page - 1) * pageSize + 1;
        const end = Math.min(page * pageSize, totalElements);
        return { start, end };
    };

    const displayRange = getDisplayRange();

    return (
        <div className="reports-list-container">
            <div className="reports-list-header">
                <div className="reports-list-header-content">
                    <div className="reports-list-title-section">
                        <h2 className="reports-list-title">레포트 목록</h2>
                        <p className="reports-list-subtitle">생성된 레포트를 확인하고 다운로드할 수 있습니다.</p>
                    </div>
                    <div className="reports-list-controls">
                        <select className="reports-filter-select">
                            <option>전체 유형</option>
                            <option>WIPER</option>
                            <option>ENGINE</option>
                            <option>BRAKE</option>
                            <option>LIGHT</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="reports-table-wrapper">
                <table className="reports-data-table">
                    <thead className="reports-table-header">
                    <tr>
                        <th className="reports-table-header-cell">레포트 ID</th>
                        <th className="reports-table-header-cell">작업자</th>
                        <th className="reports-table-header-cell">감사 ID</th>
                        <th className="reports-table-header-cell">검사 유형</th>
                        <th className="reports-table-header-cell">생성일</th>
                    </tr>
                    </thead>
                    <tbody className="reports-table-body">
                    {loading ? (
                        <tr>
                           <td colSpan="5" className="reports-empty-state">
                              <div className="reports-loading-container">
                                 <div className="reports-loading-spinner"></div>
                                 <span className="reports-loading-text">로딩 중...</span>
                              </div>
                           </td>
                        </tr>
                    ) : reports.length > 0 ? (
                        reports.map((report) => (
                            <ReportRow
                                key={report.reportId}
                                report={report}
                                onView={handleViewReport}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="reports-empty-state">
                                <div className="reports-empty-content">
                                    <Description className="reports-empty-icon" />
                                    <p className="reports-empty-title">생성된 레포트가 없습니다</p>
                                    <p className="reports-empty-subtitle">새로운 검사가 완료되면 레포트가 표시됩니다.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalElements > 0 && (
                <div className="reports-pagination-container">
                    <div className="reports-pagination-controls">
                        <Box>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    </div>
                </div>
            )}
        </div>
    );
}