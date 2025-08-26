import React from 'react';
import './PrivacyPolicyModal.css';
import { privacyText } from '../../pages/Signup/terms';

const PrivacyPolicyModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>개인정보 처리방침</h2>
          <button onClick={onClose}>X</button>
        </div>
        <div className="modal-body">
          <pre>{privacyText}</pre>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
