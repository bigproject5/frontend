import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './WorkerList.css';

import { fetchWorkers, deleteWorker } from '../../api/workerApi';

const WorkerList = () => {
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWorkers()
        .then((data) => {
          console.log('작업자 목록 응답:', data);
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
      await deleteWorker(id);
      setWorkers(prevWorkers =>
          prevWorkers.filter(worker => {
            const workerId = worker.id || worker.workerId;
            return workerId != id;
          })
      );
      alert('작업자가 삭제되었습니다.');
    } catch (error) {
      console.error('삭제 요청 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 검색 기능
  const filteredWorkers = workers.filter(worker => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const nameMatch = worker.name?.toLowerCase().includes(searchLower) || false;
    const loginIdMatch = worker.loginId?.toLowerCase().includes(searchLower) || false;
    const departmentMatch = worker.department?.toLowerCase().includes(searchLower) || false;

    return nameMatch || loginIdMatch || departmentMatch;
  });

  // 부서별 색상 클래스 반환
  const getDepartmentClass = (department) => {
    switch(department) {
      case '도장': return '도장';
      case '와퍼':
      case '와이퍼': return '와퍼';
      case '패널': return '패널';
      case '엔진': return '엔진';
      default: return 'default';
    }
  };

  return (
      <div className="worker-list-container">
        {/* 디버깅 정보 */}
        <div className="debug-info">
          🔍 디버그: 총 {workers.length}명의 작업자 로드됨 (검색 결과: {filteredWorkers.length}명)
        </div>

        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h2>작업자 관리</h2>
            <p>검사 작업자 등록 및 관리</p>
          </div>
          <Link to="/admin/workers/register" className="register-button">
            <span>+</span>
            <span>작업자 등록</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-content">
              <div className="stat-text">
                <p>전체 작업자</p>
                <p>{workers.length}</p>
              </div>
              <span className="stat-icon">👤</span>
            </div>
          </div>
          <div className="stat-card active">
            <div className="stat-content">
              <div className="stat-text">
                <p>활성 작업자</p>
                <p>{workers.length}</p>
              </div>
              <span className="stat-icon">🟢</span>
            </div>
          </div>
          <div className="stat-card departments">
            <div className="stat-content">
              <div className="stat-text">
                <p>부서 수</p>
                <p>4</p>
              </div>
              <span className="stat-icon">🏢</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="search-section">
          <div className="search-header">
            <h3>작업자 목록 {searchTerm && `(검색: "${searchTerm}")`}</h3>
            <p>등록된 작업자들을 조회하고 관리합니다 {filteredWorkers.length !== workers.length && `- ${filteredWorkers.length}/${workers.length}명 표시`}</p>
          </div>
          <div className="search-content">
            <div className="search-input-container">
              <input
                  type="text"
                  placeholder="이름, 아이디, 부서명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
              />
              <div className="search-icon">
                <span>🔍</span>
              </div>
              {searchTerm && (
                  <button
                      onClick={() => setSearchTerm('')}
                      className="search-clear"
                  >
                    ✕
                  </button>
              )}
            </div>
          </div>
        </div>

        {/* Worker Cards */}
        <div className="worker-list">
          {filteredWorkers.length === 0 ? (
              <div className="empty-state">
                {searchTerm ? (
                    <div>
                      <p>"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
                      <button
                          onClick={() => setSearchTerm('')}
                          className="empty-state-button"
                      >
                        검색 초기화
                      </button>
                    </div>
                ) : (
                    <div>
                      <p>등록된 작업자가 없습니다.</p>
                      <Link
                          to="/admin/workers/register"
                          className="empty-state-button"
                      >
                        첫 번째 작업자 등록하기
                      </Link>
                    </div>
                )}
              </div>
          ) : (
              filteredWorkers.map((worker) => {
                const workerId = worker.workerId;
                const departmentClass = getDepartmentClass(worker.department);

                return (
                    <div key={workerId} className="worker-card">
                      <div className="worker-card-content">
                        <div className="worker-info">
                          <div className="worker-avatar">
                      <span className="worker-avatar-text">
                        {worker.name?.charAt(0) || '?'}
                      </span>
                          </div>
                          <div className="worker-details">
                            <div className="worker-tags">
                              <h3>{worker.name || 'N/A'}</h3>
                              {worker.department && (
                                  <span className={`department-tag ${departmentClass}`}>
                            {worker.department}
                          </span>
                              )}
                              <span className={`status-tag ${worker.status === '활성' ? '활성' : 'inactive'}`}>
                          {worker.status || '활성'}
                        </span>
                            </div>
                            <div className="worker-contact">
                              <span>👤 {worker.loginId || 'N/A'}</span>
                              <span>📧 {worker.email || 'N/A'}</span>
                              <span>📞 {worker.phone || worker.phoneNumber || 'N/A'}</span>
                            </div>
                            <div className="worker-meta">
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
                        <div className="worker-actions">
                          <Link
                              to={`/admin/workers/${workerId}`}
                              className="action-button profile"
                          >
                            👤 프로필
                          </Link>
                          <button
                              onClick={() => onDelete(workerId)}
                              className="action-button delete"
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