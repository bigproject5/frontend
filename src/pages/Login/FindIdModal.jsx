import React, { useState } from 'react';
import { findWorkerIdApi } from '../../api/authApi';

function FindIdModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [foundId, setFoundId] = useState('');
    const [step, setStep] = useState(1); // 1: 입력단계, 2: 결과단계

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
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
            const response = await findWorkerIdApi({
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            });

            if (response.success && response.data && response.data.loginId) {
                setFoundId(response.data.loginId);
                setStep(2);
            } else {
                alert('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('아이디 찾기 오류:', error);
            alert('아이디 찾기 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseId = () => {
        onSuccess(foundId);
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content find-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{step === 1 ? '아이디 찾기' : '아이디 찾기 결과'}</h3>
                    <button className="modal-close-btn" onClick={handleClose}>
                        ×
                    </button>
                </div>

                {step === 1 ? (
                    <form className="modal-form" onSubmit={handleSubmit}>
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
                            <button type="button" className="modal-btn cancel-btn" onClick={handleClose}>
                                취소
                            </button>
                            <button 
                                type="submit" 
                                className="modal-btn submit-btn" 
                                disabled={isLoading}
                            >
                                {isLoading ? '찾는 중...' : '아이디 찾기'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="modal-result">
                        <div className="result-content">
                            <p>입력하신 정보와 일치하는 아이디입니다:</p>
                            <div className="found-id">
                                <strong>{foundId}</strong>
                            </div>
                        </div>
                        <div className="modal-buttons">
                            <button type="button" className="modal-btn cancel-btn" onClick={handleClose}>
                                닫기
                            </button>
                            <button 
                                type="button" 
                                className="modal-btn submit-btn" 
                                onClick={handleUseId}
                            >
                                이 아이디로 로그인
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FindIdModal;