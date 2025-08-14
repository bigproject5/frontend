import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const WorkerList = () => {
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/operation/workers')
      .then((response) => response.json())
      .then((data) => {
        console.log('🔍 작업자 목록 응답:', data);
        if (data.data) {
          setWorkers(data.data);
        } else if (Array.isArray(data)) {
          setWorkers(data);
        } else {
          setWorkers([]);
        }
      })
      .catch((error) => console.error('작업자 목록 불러오기 실패:', error));
  }, []);

  // 삭제 함수
  const onDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/operation/workers/${id}`, {
        method: 'DELETE',
      });

      console.log('🔍 삭제 응답 상태:', response.status);

      // HTTP 상태 코드가 성공 범위(200-299)인지 확인
      if (response.ok) {
        // 응답 본문이 있는지 확인
        const text = await response.text();
        console.log('🔍 삭제 응답 텍스트:', text);

        let data = null;
        if (text.trim()) {
          try {
            data = JSON.parse(text);
            console.log('🔍 삭제 응답 데이터:', data);
          } catch (parseError) {
            console.log('JSON 파싱 실패, 하지만 삭제는 성공한 것으로 처리');
          }
        }

        // UI에서 해당 작업자 제거
        setWorkers(prevWorkers =>
          prevWorkers.filter(worker => {
            const workerId = worker.id || worker.workerId;
            return workerId != id;
          })
        );

        alert('✅ 작업자가 삭제되었습니다.');

      } else {
        // HTTP 오류 상태
        const errorText = await response.text();
        console.error('삭제 HTTP 오류:', response.status, errorText);

        // 404 오류인 경우 이미 삭제된 것일 수 있음
        if (response.status === 404) {
          setWorkers(prevWorkers =>
            prevWorkers.filter(worker => {
              const workerId = worker.id || worker.workerId;
              return workerId != id;
            })
          );
          alert('✅ 작업자가 이미 삭제되었습니다.');
        } else {
          alert(`❌ 삭제 실패: HTTP ${response.status}`);
        }
      }

    } catch (error) {
      console.error('삭제 요청 실패:', error);
      alert('❌ 삭제 중 네트워크 오류가 발생했습니다.');
    }
  };

  // 검색 기능
  const filteredWorkers = workers.filter(worker => {
    if (!searchTerm.trim()) return true; // 검색어가 없으면 모든 작업자 표시

    const searchLower = searchTerm.toLowerCase();

    // 이름, 로그인ID, 부서명에서 검색
    const nameMatch = worker.name?.toLowerCase().includes(searchLower) || false;
    const loginIdMatch = worker.loginId?.toLowerCase().includes(searchLower) || false;
    const departmentMatch = worker.department?.toLowerCase().includes(searchLower) || false;

    return nameMatch || loginIdMatch || departmentMatch;
  });

  const getDepartmentColor = (department) => {
    switch(department) {
      case '도장': return { bg: '#dbeafe', text: '#1e40af' };
      case '와퍼':
      case '와이퍼': return { bg: '#dcfce7', text: '#16a34a' };
      case '패널': return { bg: '#f3e8ff', text: '#9333ea' };
      case '엔진': return { bg: '#fed7aa', text: '#ea580c' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div style={{
      width: '100%',
      padding: '5% 10% 200px 10%'
    }}>
      {/* 디버깅 정보 */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px',
        fontSize: '12px',
        color: '#0369a1'
      }}>
        🔍 디버그: 총 {workers.length}명의 작업자 로드됨 (검색 결과: {filteredWorkers.length}명)
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
          }}>작업자 관리</h2>
          <p style={{ 
            color: '#6b7280', 
            marginTop: '4px',
            margin: 0 
          }}>검사 작업자 등록 및 관리</p>
        </div>
        <Link 
          to="/admin/workers/register"
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
          }}>작업자 목록 {searchTerm && `(검색: "${searchTerm}")`}</h3>
          <p style={{
            fontSize: '14px', 
            color: '#6b7280',
            margin: 0,
            marginTop: '4px'
          }}>등록된 작업자들을 조회하고 관리합니다 {filteredWorkers.length !== workers.length && `- ${filteredWorkers.length}/${workers.length}명 표시`}</p>
        </div>
        <div style={{ padding: '16px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="이름, 아이디, 부서명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: searchTerm ? '40px' : '16px', // X 버튼 공간
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
            {/* 검색어 지우기 버튼 */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  fontSize: '16px',
                  padding: '0',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Worker Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredWorkers.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '48px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            {searchTerm ? (
              <div>
                <p>"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  검색 초기화
                </button>
              </div>
            ) : (
              <div>
                <p>등록된 작업자가 없습니다.</p>
                <Link
                  to="/admin/workers/register"
                  style={{
                    backgroundColor: '#1e40af',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '14px'
                  }}
                >
                  첫 번째 작업자 등록하기
                </Link>
              </div>
            )}
          </div>
        ) : (
          filteredWorkers.map((worker) => {
            const depColor = getDepartmentColor(worker.department);
            const workerId = worker.id || worker.workerId;

            return (
              <div
                key={workerId}
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
                        {worker.name?.charAt(0) || '?'}
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
                        }}>{worker.name || 'N/A'}</h3>
                        {worker.department && (
                          <span style={{
                            padding: '2px 8px',
                            fontSize: '12px',
                            borderRadius: '12px',
                            backgroundColor: depColor.bg,
                            color: depColor.text
                          }}>
                            {worker.department}
                          </span>
                        )}
                        <span style={{
                          padding: '2px 8px',
                          fontSize: '12px',
                          borderRadius: '12px',
                          backgroundColor: worker.status === '활성' ? '#dcfce7' : '#fee2e2',
                          color: worker.status === '활성' ? '#16a34a' : '#dc2626'
                        }}>
                          {worker.status || '활성'}
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
                        <span>👤 {worker.loginId || 'N/A'}</span>
                        <span>📧 {worker.email || 'N/A'}</span>
                        <span>📞 {worker.phone || worker.phoneNumber || 'N/A'}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '12px',
                        color: '#9ca3af'
                      }}>
                        <span>사번: {worker.employeeNumber || 'N/A'}</span>
                        <span>등록일: {
                          worker.createdAt
                            ? new Date(worker.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              })
                            : worker.joinDate || worker.createDate || 'N/A'
                        }</span>
                        <span>최근 활동: {worker.lastAccess || '알 수 없음'}</span>
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
                      onClick={() => onDelete(workerId)}
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
          })
        )}
      </div>
    </div>
  );
};

export default WorkerList;