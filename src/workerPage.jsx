import React from 'react';
import './workerPage.css';

function WorkerPage() {
    return (
        <div className='worker-body'>
            <div className="profile-container">
                {/* 왼쪽 프로필 */}
                <div className="profile-sidebar">
                    <div className="avatar" />
                    <div className="name">홍 길 동</div>
                </div>

                {/* 오른쪽 정보 */}
                <div className="profile-content">
                    {/* 내 정보 */}
                    <div className="info-section">
                        <h2>내 정보</h2>
                        <div className="info-row">
                            <div className="info-labels">
                                <div className='type-labels'>이름</div>
                                <input type="text" disabled />
                            </div>
                            <div className="info-labels">
                                <div className='type-labels'>사번</div>
                                <input type="text" disabled />
                            </div>
                            <div className="info-labels">
                                <div className='type-labels'>이메일</div>
                                <input type="text" disabled />
                            </div>
                            <div className="info-labels">
                                <div className='type-labels'>비밀번호</div>
                                <input type="text" disabled />
                            </div>
                        </div>
                        <button className="edit-button">수정</button>
                    </div>

                    {/* 내 보고서 */}
                    <div className="report-section">
                        <div className="report-header">
                            <span className="menu-icon">☰</span>
                            <h3>내 보고서</h3>
                        </div>
                        <div className="report-list">
                            <div className="report-card">
                                <div className="report-title">보고서 제목</div>
                                <div className="report-date">2025/05/23</div>
                            </div>
                            <div className="report-card">
                                <div className="report-title">보고서 제목</div>
                                <div className="report-date">2025/05/23</div>
                            </div>
                            {/* 필요 시 추가 */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkerPage;
