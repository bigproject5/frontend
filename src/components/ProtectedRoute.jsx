import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, role, isInitializing } = useSelector((state) => state.auth);

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "role:", role, "isInitializing:", isInitializing);

  // 초기화 중이면 로딩 화면 표시
  if (isInitializing) {
    return (
      <>
        <Outlet />
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <div>로딩 중...</div>
        </div>
      </>

    );
  }

  if (!isAuthenticated) {
    console.log("로그인이 필요합니다.");
      if (!isAuthenticated) {
          return <Navigate to={requiredRole === 'ADMIN' ? '/admin-login' : '/login'} replace />;
      }
  }

    if (requiredRole && role !== requiredRole && role !== 'DEV') {
        return <Navigate to={requiredRole === 'ADMIN' ? '/admin-login' : '/login'} replace />;
    }

  return <Outlet />;
};

export default ProtectedRoute;
