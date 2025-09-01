import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {workerRegister} from "../../api/workerApi.js";




const WorkerForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    name: '',
    employeeNumber: '',
    taskType: '', // department를 taskType으로 변경
    email: '',
    address: '',
    phone: ''
  });

  // ===== 테스트용 예시 데이터들 =====
  const testDataSets = [
    {
      name: '홍길동',
      loginId: 'hong1234',
      password: 'password123!',
      employeeNumber: 'EMP001',
      taskType: 'PAINT', // department를 taskType으로 변경하고 API 값으로 변경
      email: 'hong@hyundai.com',
      phone: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123'
    },
    {
      name: '김철수',
      loginId: 'kim45678',
      password: 'password456!',
      employeeNumber: 'EMP002',
      taskType: 'ENGINE', // department를 taskType으로 변경하고 API 값으로 변경
      email: 'kim@hyundai.com',
      phone: '010-9876-5432',
      address: '부산시 해운대구 해운대로 456'
    },
    {
      name: '박영희',
      loginId: 'park7890',
      password: 'password789!',
      employeeNumber: 'EMP003',
      taskType: 'LAMP', // department를 taskType으로 변경하고 API 값으로 변경
      email: 'park@hyundai.com',
      phone: '010-5555-7777',
      address: '대구시 수성구 수성로 789'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // 에러 메시지 제거
    if (error) setError('');
  };

  // ===== 테스트 데이터 자동 입력 함수 =====
  const fillTestData = (index) => {
    setFormData(testDataSets[index]);
    setError('');
  };

  // ===== 폼 초기화 함수 =====
  const clearForm = () => {
    setFormData({
      loginId: '',
      password: '',
      name: '',
      employeeNumber: '',
      taskType: '', // department를 taskType으로 변경
      email: '',
      address: '',
      phone: ''
    });
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

     // 필수 필드 유효성 검사
    const requiredFields = ['loginId', 'password', 'name', 'employeeNumber', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field]?.trim());

    if (missingFields.length > 0) {
      setError(`다음 필드를 입력해주세요: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    // API 명세서에 맞게 데이터 변환
    const submitData = {
      loginId: formData.loginId,
      password: formData.password,
      employeeNumber: formData.employeeNumber,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phone,
      address: formData.address,
      taskType: formData.taskType // taskType 직접 사용
    };

    try {
      await workerRegister(submitData);
      alert('✅ 작업자 등록이 완료되었습니다!');
      navigate('/admin/workers');

    } catch (err) {
      console.error('등록 요청 실패:', err);

      let errorMessage = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';

      if (err.response) {
        console.error('서버 응답 데이터:', err.response.data);
        console.error('서버 응답 상태:', err.response.status);

        errorMessage = err.response.data?.message || `등록에 실패했습니다. (오류 코드: ${err.response.status})`;
      } else if (err.request) {
        console.error('서버로부터 응답을 받지 못했습니다:', err.request);
        errorMessage = '서버 응답이 없습니다. 네트워크 연결을 확인해주세요.';
      } else {
        console.error('요청 설정 오류:', err.message);
        errorMessage = '요청 중 오류가 발생했습니다.';
      }
      setError(errorMessage);
     } finally {
       setLoading(false); // 성공/실패 여부와 관계없이 로딩 종료
     }
  }

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
    <div style={{ margin: '10%' }}>
      {/* ===== 테스트 데이터 버튼 영역 ===== */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <h4 style={{
          margin: '0 0 12px 0',
          color: '#0369a1',
          fontSize: '14px',
          fontWeight: '600'
        }}>🧪 테스트 데이터 (개발용)</h4>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <button
            onClick={() => fillTestData(0)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            홍길동 데이터
          </button>
          <button
            onClick={() => fillTestData(1)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            김철수 데이터
          </button>
          <button
            onClick={() => fillTestData(2)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            박영희 데이터
          </button>
          <button
            onClick={clearForm}
            style={{
              padding: '6px 12px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            폼 초기화
          </button>
        </div>
      </div>

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

      {/* ===== 에러 메시지 ===== */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}

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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              사원번호
            </label>
            <input
              type="text"
              placeholder="사번호를 입력하세요"
              value={formData.employeeNumber}
              onChange={(e) => handleInputChange('employeeNumber', e.target.value)}
              style={inputStyle}
              disabled={loading}
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
              작업 유형
            </label>
            <select
              value={formData.taskType}
              onChange={(e) => handleInputChange('taskType', e.target.value)}
              style={inputStyle}
              disabled={loading}
            >
              <option value="">작업 유형을 선택하세요</option>
              <option value="PAINT">도장</option>
              <option value="WIPER">와이퍼</option>
              <option value="LAMP">램프</option>
              <option value="ENGINE">엔진</option>
              <option value="EM_WAVE">전자파</option>
              <option value="WASHER_FLUID">워셔액</option>
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
            to="/admin/workers"
            style={{
              padding: '8px 24px',
              border: '1px solid #d1d5db',
              color: '#374151',
              backgroundColor: 'white',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-block',
              opacity: loading ? 0.6 : 1,
              pointerEvents: loading ? 'none' : 'auto'
            }}
          >
            취소
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '8px 24px',
              backgroundColor: loading ? '#9ca3af' : '#1e40af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              minWidth: '80px'
            }}
          >
            {loading ? '등록 중...' : '등록'}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerForm;
