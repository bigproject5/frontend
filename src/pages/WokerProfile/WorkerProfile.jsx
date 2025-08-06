import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportSection from './ReportSection.jsx';
import './WorkerProfile.css';
import { getUserInfo } from '../phm_api.jsx';

function WorkerProfile() {
    const navigate = useNavigate();
    const [isError, setIsError] = useState(false);
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
            const token = sessionStorage.getItem('accessToken');
            const response = getUserInfo(token);
            const data = await response;

            if (!token) throw new Error('Access token not found in sessionStorage.');
            console.log(data)
            setUserInfo({
                name: data.name,
                employeeId: data.employeeNumber,
                email: data.email
            });
        } catch (error) {
            console.error('사용자 정보 로드 실패:', error);
            setIsError(true);
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
    if (isError) {
        return (
            <div style={{
                width: "100vw",
                textAlign: "center"
            }}>
                <h1>404</h1>
                <h2>Not Found</h2>
                작업자를 찾을 수 없습니다.
            </div>
        )
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