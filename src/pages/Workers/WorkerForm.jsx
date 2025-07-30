import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const WorkerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    name: '',
    companyNumber: '',
    department: '',
    email: '',
    address: '',
    phone: ''
  });
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    fetch('http://localhost:8080/api/operation/workers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then(res => {
      if (!res.ok) throw new Error('등록 실패');
      return res.json();
    })
    .then(() => {
      alert('작업자 등록 성공!');
      navigate('/workers');
    })
    .catch(err => alert('등록 오류: ' + err.message));
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    minWidth: 0
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#111827',
            margin: 0 
          }}>작업자 등록</h2>
          <p style={{ 
            color: '#6b7280', 
            marginTop: '4px',
            margin: 0 
          }}>새로운 작업자를 시스템에 등록합니다.</p>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        marginBottom: '16px',
        width: '100%'
      }}>
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            fontWeight: '600', 
            color: '#111827',
            margin: 0,
            fontSize: '16px'
          }}>작업자 정보 입력</h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280',
            margin: 0,
            marginTop: '4px'
          }}>모든 필드를 입력해주세요.</p>
        </div>
        <div style={{ padding: '24px' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          width: '100%'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              로그인 ID
            </label>
            <input
              type="text"
              placeholder="로그인 ID를 입력하세요"
              value={formData.loginId}
              onChange={(e) => handleInputChange('loginId', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              이름
            </label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              회사번호
            </label>
            <input
              type="text"
              placeholder="회사번호를 입력하세요"
              value={formData.companyNumber}
              onChange={(e) => handleInputChange('companyNumber', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              부서
            </label>
            <select
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              style={inputStyle}
            >
              <option value="">부서를 선택하세요</option>
              <option value="탐상">도장</option>
              <option value="엣어퍼">와이퍼</option>
              <option value="비젠싱">패널</option>
              <option value="연전">엔진</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              이메일
            </label>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              연락처
            </label>
            <input
              type="text"
              placeholder="연락처를 입력하세요"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              주소
            </label>
            <input
              type="text"
              placeholder="주소를 입력하세요"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '16px',
          marginTop: '32px'
        }}>
          <Link
            to="/workers"
            style={{
              padding: '8px 24px',
              border: '1px solid #d1d5db',
              color: '#374151',
              backgroundColor: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            취소
          </Link>
          <button
            onClick={handleSubmit}
            style={{
              padding: '8px 24px',
              backgroundColor: '#1e40af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            등록
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerForm;