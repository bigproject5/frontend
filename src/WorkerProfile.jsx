import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportSection from './ReportSection';
import './WorkerProfile.css';

function WorkerProfile() {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        name: '',
        employeeId: '',
        email: '',
        password: '••••••••'
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    // 사용자 정보 로드
    const loadUserData = async () => {
        try {
            // API 호출 시뮬레이션
            // const response = await fetch('/api/user/profile');
            // const data = await response.json();

            setUserInfo({
                name: data.name || '홍길동',
                employeeId: data.employeeId || 'EMP001',
                email: data.email || 'hong@company.com'
            });
        } catch (error) {
            console.error('사용자 정보 로드 실패:', error);
            // 기본값 설정
            setUserInfo({
                name: '홍길동',
                employeeId: 'EMP001',
                email: 'hong@company.com'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProfiled = () => {
        navigate("/")
    }

    if (isLoading) {
        return (
            <div className="loading-container">
                로딩 중...
            </div>
        );
    }

    return (
        <div className="worker-profile-page">
            <div className="profile-container">
                <div className="profile-layout">
                    {/* 왼쪽 프로필 */}
                    <div className="profile-sidebar">
                        <div className="avatar">
                            👤
                            {/* 작업자 프로필 이미지 */}
                        </div>
                        <div className="user-name">
                            {userInfo.name}
                        </div>
                        <div className="employee-id">
                            {userInfo.employeeId}
                        </div>
                    </div>

                    {/* 오른쪽 정보 */}
                    <div className="profile-content">
                        {/* 내 정보 */}
                        <div className="info-section">
                            <h2 className="section-title">내 정보</h2>

                            <div className="info-form">
                                {/* 이름 */}
                                <div className="info-row">
                                    <div className="info-label">이름</div>
                                    <input
                                        type="text"
                                        value={userInfo.name}
                                        disabled
                                        className="info-input info-input-disabled"
                                    />
                                </div>

                                {/* 사번 */}
                                <div className="info-row">
                                    <div className="info-label">사번</div>
                                    <input
                                        type="text"
                                        value={userInfo.employeeId}
                                        disabled
                                        className="info-input info-input-disabled"
                                    />
                                </div>

                                {/* 이메일 */}
                                <div className="info-row">
                                    <div className="info-label">이메일</div>
                                    <input
                                        type="text"
                                        value={userInfo.email}
                                        disabled
                                        className="info-input info-input-disabled"
                                    />
                                </div>

                                {/* 비밀번호 */}
                                <div className="info-row">
                                    <div className="info-label">비밀번호</div>
                                    <input
                                        type="password"
                                        value={"••••••••"}
                                        disabled
                                        className="info-input info-input-disabled"
                                    />
                                </div>
                            </div>

                            <div className="button-group">
                                <button onClick={handleEditProfiled} className="btn btn-edit">
                                    정보 수정
                                </button>
                            </div>
                        </div>

                        {/* 내 보고서 컴포넌트 */}
                        <div className="report-wrapper">
                            <ReportSection />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkerProfile;