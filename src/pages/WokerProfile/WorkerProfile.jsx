import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReportSection from './ReportSection.jsx';
import './WorkerProfile.css';
import {editWorkerProfile, getUserInfo, getWorkerProfileByAdmin } from '../../api/phm_api.jsx';
import ProfileEditModal from "./ProfileEditModal.jsx";
import AdminProfileEditModal from "./AdminProfileEditModal.jsx";

function WorkerProfile() {
    const navigate = useNavigate();
    const { id } = useParams(); // URL에서 workerId 파라미터 추출
    const { role } = useSelector(state => state.auth);

    const isAdmin = () => role === 'ADMIN' || role === "DEV";

    const [isError, setIsError] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: '',
        employeeId: '',
        email: '',
        phoneNumber: '',
        loginId: '',
        taskType: '',
        department: '',    // 부서 추가
        status: '활성'     // 상태 추가
    });

    const [isLoading, setIsLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);           // 작업자용 모달
    const [adminEditModalOpen, setAdminEditModalOpen] = useState(false); // 관리자용 모달

    // 사용자 데이터 로드
    const loadUserData = useCallback(async () => {
        try {
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                console.error('Access token not found in sessionStorage.');
                throw new Error('인증 토큰이 없습니다.');
            }

            let response;

            // 관리자인 경우 URL의 workerId 사용, 작업자인 경우 자신의 ID 사용
            if (isAdmin()) {
                response = await getWorkerProfileByAdmin(token, id);
            } else {
                response = await getUserInfo(token); // 본인 정보만
            }

            setUserInfo({
                name: response.name,
                employeeId: response.employeeNumber,
                email: response.email,
                phoneNumber: response.phoneNumber,
                loginId: response.loginId,
                taskType: response.taskType,
                department: response.department || response.taskType, // department가 없으면 taskType 사용
                status: response.status || '활성'
            });
        } catch (error) {
            console.error('사용자 정보 로드 실패:', error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [id, isAdmin]);

    useEffect(() => {
        loadUserData();
    }, []);

    // 프로필 편집 버튼 클릭 핸들러
    const handleEditProfile = () => {
        if (isAdmin()) {
            // 관리자인 경우 관리자 전용 모달 열기
            setAdminEditModalOpen(true);
        } else {
            // 작업자인 경우 기본 모달 열기
            setEditModalOpen(true);
        }
    };

    // 작업자용 프로필 저장
    const handleSaveProfile = async (updatedData) => {
        try {
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                throw new Error('인증 토큰이 없습니다.');
            }

            // API 호출로 프로필 업데이트
            const response = await editWorkerProfile(token, updatedData);

            // 성공 시 로컬 상태 업데이트
            setUserInfo(prev => ({
                ...prev,
                ...updatedData
            }));

            console.log('프로필이 성공적으로 업데이트되었습니다.');
            console.log(response);

        } catch (error) {
            console.error('프로필 수정 실패:', error);
            throw error;
        }
    };

    // 관리자용 프로필 저장
    const handleAdminSaveProfile = async (updatedData) => {
        try {
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                throw new Error('인증 토큰이 없습니다.');
            }

            // workerId를 updatedData에 추가
            const dataWithWorkerId = {
                ...updatedData,
                workerId: id
            };

            // 관리자 권한으로 작업자 정보 업데이트 API 호출
            const response = await editWorkerProfile(token, dataWithWorkerId);

            // 성공 시 로컬 상태 업데이트
            setUserInfo(prev => ({
                ...prev,
                ...updatedData,
                // employeeNumber를 employeeId로 매핑
                employeeId: updatedData.employeeNumber || updatedData.employeeId,
                // department를 taskType으로도 설정
                taskType: updatedData.department || prev.taskType
            }));

            console.log('작업자 정보가 성공적으로 업데이트되었습니다.');
            console.log(response);

        } catch (error) {
            console.error('작업자 정보 수정 실패:', error);
            throw error;
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
                            <label>작업타입</label>
                            <span>{userInfo.taskType || userInfo.department}</span>
                        </div>
                        {isAdmin() && (
                            <div className="info-item">
                                <label>상태</label>
                                <span>{userInfo.status}</span>
                            </div>
                        )}
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

            {/* 작업자 전용 프로필 편집 모달 */}
            {!isAdmin() && (
                <ProfileEditModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    userInfo={userInfo}
                    onSave={handleSaveProfile}
                />
            )}

            {/* 관리자 전용 프로필 편집 모달 */}
            {isAdmin() && (
                <AdminProfileEditModal
                    open={adminEditModalOpen}
                    onClose={() => setAdminEditModalOpen(false)}
                    userInfo={userInfo}
                    onSave={handleAdminSaveProfile}
                />
            )}
        </div>
    );
}

export default WorkerProfile;