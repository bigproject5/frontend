import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReportSection from './ReportSection.jsx';
import './WorkerProfile.css';
import { getUserInfo } from '../../api/phm_api.jsx';

function WorkerProfile() {
    const navigate = useNavigate();
    const { workerId } = useParams(); // URL에서 workerId 파라미터 추출
    const { user, role } = useSelector(state => state.auth);

    const isAdmin = () => role === 'ADMIN' || role === "DEV";
    const getWorkerId = () => user?.id || 1;

    const [isError, setIsError] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: '',
        employeeId: '',
        email: '',
        phoneNumber: '',  // 전화번호 추가
        loginId: '',
        taskType: ''
    });

    const [isLoading, setIsLoading] = useState(true);

    // useCallback으로 감싸서 의존성 문제 해결
    const loadUserData = useCallback(async () => {
        try {
            let targetWorkerId;

            // 관리자인 경우 URL의 workerId 사용, 작업자인 경우 자신의 ID 사용
            if (isAdmin()) {
                targetWorkerId = workerId;
            } else {
                targetWorkerId = getWorkerId();
            }

            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                console.error('Access token not found in sessionStorage.');
                throw new Error('인증 토큰이 없습니다.');
            }

            // 실제 API 호출 시에는 targetWorkerId를 사용하여 해당 작업자 정보 조회
            const response = await getUserInfo(token, targetWorkerId);

            setUserInfo({
                name: response.name,
                employeeId: response.employeeNumber,
                email: response.email,
                phoneNumber: response.phoneNumber,
                loginId: response.loginId,
                taskType: response.taskType,
            });
        } catch (error) {
            console.error('사용자 정보 로드 실패:', error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [workerId, isAdmin, getWorkerId]);

    useEffect(() => {
        loadUserData();
    }, []);

    const handleEditProfile = () => {
        if (isAdmin()) {
            // 관리자인 경우 작업자 편집 페이지로 이동
            navigate(`/admin/workers/${workerId}/edit`);
        } else {
            // 작업자인 경우 프로필 편집 페이지로 이동
            navigate("/worker/profile/edit");
        }
    };

    const handleGoBack = () => {
        if (isAdmin()) {
            navigate("/admin/workers");
        } else {
            navigate("/worker/main");
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>사용자 정보를 불러오는 중...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="error-container">
                <h3>오류가 발생했습니다</h3>
                <p>사용자 정보를 불러올 수 없습니다.</p>
                <button onClick={loadUserData} className="retry-button">
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="worker-profile-container">
            <div className="profile-header">
                <div className="header-content">
                    <h1>{isAdmin() ? '작업자 정보' : '내 프로필'}</h1>
                    <div className="header-actions">
                        {isAdmin() && (
                            <button onClick={handleGoBack} className="back-button">
                                목록으로
                            </button>
                        )}
                        <button onClick={handleEditProfile} className="edit-button">
                            {isAdmin() ? '정보 수정' : '프로필 편집'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-info-section">
                    <h2>기본 정보</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>이름</label>
                            <span>{userInfo.name}</span>
                        </div>
                        <div className="info-item">
                            <label>로그인 ID</label>
                            <span>{userInfo.loginId}</span>
                        </div>
                        <div className="info-item">
                            <label>이메일</label>
                            <span>{userInfo.email}</span>
                        </div>
                        <div className="info-item">
                            <label>전화번호</label>
                            <span>{userInfo.phoneNumber}</span>
                        </div>
                        <div className="info-item">
                            <label>사원번호</label>
                            <span>{userInfo.employeeId}</span>
                        </div>
                        <div className="info-item">
                            <label>작업 </label>
                            <span>{userInfo.taskType}</span>
                        </div>
                    </div>
                </div>

                {/* 작업자 전용 리포트 섹션 */}
                {!isAdmin() && <ReportSection />}

                {/* 관리자가 작업자 정보를 볼 때의 추가 정보 */}
                {isAdmin() && (
                    <div className="admin-view-section">
                        <h2>작업 현황</h2>
                        <div className="work-status-grid">
                            <div className="status-card">
                                <h3>진행 중인 검사</h3>
                                <span className="status-number">5</span>
                            </div>
                            <div className="status-card">
                                <h3>완료된 검사</h3>
                                <span className="status-number">23</span>
                            </div>
                            <div className="status-card">
                                <h3>이번 달 성과</h3>
                                <span className="status-number">95%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WorkerProfile;