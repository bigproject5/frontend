import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const WorkerList = () => {
  // 임시 데이터 (나중에 상태관리로 이동)
  /*const workers = [
    {
      id: 'EMP2024001',
      name: '김현태',
      loginId: 'kim.hyundai',
      password: '****',
      email: 'kim.hyundai@hyundai.com',
      phone: '010-1234-5678',
      department: '도장',
      address: '서울시 강남구',
      companyNumber: 'EMP2024001',
      joinDate: '2024-01-15',
      lastAccess: '2시간 전',
      status: '활성'
    }
  ];*/

  const [workers, setWorkers] = useState([]);
  const [editingWorkerId, setEditingWorkerId] = useState(null);
  const [editedWorker, setEditedWorker] = useState({});

  useEffect(() => {
    fetch('http://localhost:8080/api/operation/workers')
      .then((response) => response.json())
      .then((data) => setWorkers(data))
      .catch((error) => console.error('작업자 목록 불러오기 실패:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/operation/workers/${id}`, {
      method: 'DELETE',
    })
      .then(() => setWorkers(workers.filter((worker) => worker.id !== id)))
      .catch((error) => console.error('삭제 실패:', error));
  };

  const handleEdit = (worker) => {
    setEditingWorkerId(worker.id);
    setEditedWorker(worker);
  };

  const handleChange = (e) => {
    setEditedWorker({ ...editedWorker, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    fetch(`http://localhost:8080/api/operation/workers/${editingWorkerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedWorker),
    })
      .then((response) => response.json())
      .then((updatedWorker) => {
        setWorkers(workers.map((w) => (w.id === editingWorkerId ? updatedWorker : w)));
        setEditingWorkerId(null);
        setEditedWorker({});
      })
      .catch((error) => console.error('수정 실패:', error));
  };


  const getDepartmentColor = (department) => {
    switch(department) {
      case '도장': return { bg: '#dbeafe', text: '#1e40af' };
      case '와퍼': return { bg: '#dcfce7', text: '#16a34a' };
      case '패널': return { bg: '#f3e8ff', text: '#9333ea' };
      case '엔진': return { bg: '#fed7aa', text: '#ea580c' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div style={{ width: '100%'}}>
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
          }}>작업자 관리</h2>
          <p style={{ 
            color: '#6b7280', 
            marginTop: '4px',
            margin: 0 
          }}>검사 작업자 등록 및 관리</p>
        </div>
        <Link 
          to="/workers/register"
          style={{
            backgroundColor: '#1e40af',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            textDecoration: 'none'
          }}
        >
          <span>+</span>
          <span>작업자 등록</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: '#dbeafe',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #bfdbfe'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ 
                color: '#1d4ed8', 
                fontSize: '14px',
                margin: 0
              }}>전체 작업자</p>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#1e40af',
                margin: 0
              }}>{workers.length}</p>
            </div>
            <span style={{ fontSize: '24px', color: '#2563eb' }}>👤</span>
          </div>
        </div>
        <div style={{
          backgroundColor: '#dcfce7',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ 
                color: '#15803d', 
                fontSize: '14px',
                margin: 0
              }}>활성 작업자</p>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#16a34a',
                margin: 0
              }}>3</p>
            </div>
            <span style={{ fontSize: '24px', color: '#16a34a' }}>🟢</span>
          </div>
        </div>
        <div style={{
          backgroundColor: '#dbeafe',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #bfdbfe'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ 
                color: '#1d4ed8', 
                fontSize: '14px',
                margin: 0
              }}>부서 수</p>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#1e40af',
                margin: 0
              }}>4</p>
            </div>
            <span style={{ fontSize: '24px', color: '#2563eb' }}>🏢</span>
          </div>
        </div>
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #fde68a'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ 
                color: '#b45309', 
                fontSize: '14px',
                margin: 0
              }}>호출 대기</p>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#d97706',
                margin: 0
              }}>2</p>
            </div>
            <span style={{ fontSize: '24px', color: '#d97706' }}>📞</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
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
          }}>작업자 목록</h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280',
            margin: 0,
            marginTop: '4px'
          }}>등록된 작업자들을 조회하고 관리합니다</p>
        </div>
        <div style={{ padding: '16px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="이름, 아이디, 부서명 검색..."
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '16px',
                paddingTop: '8px',
                paddingBottom: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}>
              <span style={{ color: '#9ca3af' }}>🔍</span>
            </div>
          </div>
        </div>
      </div>

      {/* Worker Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {workers.map((worker) => {
          const depColor = getDepartmentColor(worker.department);
          return (
            <div 
              key={worker.id} 
              style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#2563eb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '18px'
                    }}>
                      {worker.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <h3 style={{ 
                        fontWeight: 'bold', 
                        color: '#111827',
                        margin: 0,
                        fontSize: '16px'
                      }}>{worker.name}</h3>
                      <span style={{
                        padding: '2px 8px',
                        fontSize: '12px',
                        borderRadius: '12px',
                        backgroundColor: depColor.bg,
                        color: depColor.text
                      }}>
                        {worker.department}
                      </span>
                      <span style={{
                        padding: '2px 8px',
                        fontSize: '12px',
                        borderRadius: '12px',
                        backgroundColor: worker.status === '활성' ? '#dcfce7' : '#fee2e2',
                        color: worker.status === '활성' ? '#16a34a' : '#dc2626'
                      }}>
                        {worker.status}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '4px'
                    }}>
                      <span>👤 {worker.loginId}</span>
                      <span>📧 {worker.email}</span>
                      <span>📞 {worker.phone}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}>
                      <span>사번: {worker.companyNumber}</span>
                      <span>등록일: {worker.joinDate}</span>
                      <span>최근 활동: {worker.lastAccess}</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <button style={{
                    padding: '8px',
                    color: '#2563eb',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>
                    📞 호출
                  </button>
                  <button 
                    onClick={() => onEdit(worker)}
                    style={{
                      padding: '8px',
                      color: '#6b7280',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    ✏️ 수정
                  </button>
                  <button 
                    onClick={() => onDelete(worker.id)}
                    style={{
                      padding: '8px',
                      color: '#dc2626',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🗑️ 삭제
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkerList;