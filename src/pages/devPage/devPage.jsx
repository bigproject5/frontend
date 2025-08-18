import React from 'react';
import { Link } from 'react-router-dom';

const DevPage = () => {
  const pages = [
    { path: '/notices', name: '공지사항 목록' },
    { path: '/admin/dashboard', name: '관리자 대시보드' },
    { path: '/admin/notices/new', name: '관리자 공지사항 등록' },
    { path: '/admin/workers', name: '관리자 작업자 목록' },
    { path: '/admin/workers/register', name: '관리자 작업자 등록' },
    { path: '/worker/profile', name: '작업자 프로필' },
    { path: '/worker/main', name: '작업자 메인' },
    { path: '/worker/manual-test', name: '작업자 수동 테스트' }
  ];

  const containerStyle = {
    maxWidth: 900,
    margin: '40px auto',
    padding: 20,
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
    gap: 15,
    marginTop: 20,
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#333',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  };

  const cardHover = {
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    transform: 'translateY(-3px)',
    color: '#007bff',
  };

  return (
      <div style={containerStyle}>
        <h1>개발자 페이지</h1>
        <p>아래 주요 페이지로 이동할 수 있습니다.</p>

        <div style={gridStyle}>
          {pages.map(({ path, name }) => (
              <Link
                  key={path}
                  to={path}
                  style={cardStyle}
                  onMouseEnter={e => {
                    Object.assign(e.currentTarget.style, cardHover);
                  }}
                  onMouseLeave={e => {
                    Object.assign(e.currentTarget.style, cardStyle);
                  }}
              >
                {name}
              </Link>
          ))}
        </div>
      </div>
  );
};

export default DevPage;
