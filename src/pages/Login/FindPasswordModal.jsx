import React, { useState } from 'react';

function FindPasswordModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        loginId: '',
        name: '',
        email: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.loginId.trim() || !formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        // 전화번호 형식 검증 (숫자와 하이픈만)
        const phoneRegex = /^[\d-]+$/;
        if (!phoneRegex.test(formData.phone)) {
            alert('올바른 전화번호 형식을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        
        try {
            const response =({
                loginId: formData.loginId || "",
                name: formData.name || "",
                email: formData.email || "",
                phone: formData.phone || ""
            });

            if (response.success) {
                alert('임시 비밀번호가 등록된 이메일로 발송되었습니다.\n로그인 후 반드시 비밀번호를 변경해주세요.');
                onSuccess();
            } else {
                alert('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('비밀번호 찾기 오류:', error);
            if (error.response && error.response.status === 404) {
                alert('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.');
            } else {
                alert('비밀번호 찾기 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content find-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>비밀번호 찾기</h3>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-description">
                    <p>등록된 정보를 입력하시면 임시 비밀번호를 이메일로 발송해드립니다.</p>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="modal-input-group">
                        <label>
                            아이디
                            <input
                                type="text"
                                name="loginId"
                                value={formData.loginId}
                                onChange={handleChange}
                                placeholder="아이디를 입력하세요"
                                className="modal-input"
                                required
                            />
                        </label>
                    </div>

                    <div className="modal-input-group">
                        <label>
                            이름
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="이름을 입력하세요"
                                className="modal-input"
                                required
                            />
                        </label>
                    </div>

                    <div className="modal-input-group">
                        <label>
                            이메일
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="이메일을 입력하세요"
                                className="modal-input"
                                required
                            />
                        </label>
                    </div>

                    <div className="modal-input-group">
                        <label>
                            전화번호
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
                                className="modal-input"
                                required
                            />
                        </label>
                    </div>

                    <div className="modal-buttons">
                        <button type="button" className="modal-btn cancel-btn" onClick={onClose}>
                            취소
                        </button>
                        <button 
                            type="submit" 
                            className="modal-btn submit-btn" 
                            disabled={isLoading}
                        >
                            {isLoading ? '처리 중...' : '임시 비밀번호 발송'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FindPasswordModal;