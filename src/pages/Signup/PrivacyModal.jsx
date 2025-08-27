import React from "react";
import { termsText, privacyText, marketingText } from "./terms";
import "./modal.css";

export default function PolicyModal({ visible, agreements, setAgreements, onClose }) {
    if (!visible) return null;

    const contents = {
        terms: { text: termsText, title: "서비스 이용약관", required: true },
        privacy: { text: privacyText, title: "개인정보 처리방침", required: true },
        marketing: { text: marketingText, title: "마케팅 수신 동의", required: false }
    };

    const handleChange = (key) => (e) => {
        setAgreements(prev => ({
            ...prev,
            [key]: e.target.checked
        }));
    };

    const handleConfirm = () => {
        if (agreements.terms && agreements.privacy) {
            onClose(true);
        } else {
            alert("필수 약관에 모두 동의해야 합니다.");
        }
    };

    const isConfirmDisabled = !agreements.terms || !agreements.privacy;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose(false)}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>동의 항목</h2>
                </div>

                <div className="modal-body">
                    {Object.entries(contents).map(([key, content]) => (
                        <div key={key} className="agreement-section">
                            <div
                                className="agreement-header"
                                onClick={() => handleChange(key)({ target: { checked: !agreements[key] } })}
                            >
                                <input
                                    type="checkbox"
                                    checked={agreements[key]}
                                    onChange={handleChange(key)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <span className="agreement-label">{content.title}</span>
                                <span className={content.required ? "required-badge" : "optional-badge"}>
                                    {content.required ? "필수" : "선택"}
                                </span>
                            </div>
                            <div className="agreement-content">
                                <pre>{content.text}</pre>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="modal-footer">
                    <button
                        className="modal-button cancel"
                        onClick={() => onClose(false)}
                    >
                        취소
                    </button>
                    <button
                        className="modal-button confirm"
                        onClick={handleConfirm}
                        disabled={isConfirmDisabled}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}