import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, role, isInitializing } = useSelector((state) => state.auth);

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "role:", role, "isInitializing:", isInitializing);

  // 초기화 중이면 로딩 화면 표시
  if (isInitializing) {
    return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <div>로딩 중...</div>
        </div>
    );
  }

  if (!isAuthenticated) {
    console.log("로그인이 필요합니다.");
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const userRole = role;
    const required = requiredRole;

    if (userRole === 'DEV') {
      // dev is allowed everywhere
        // 개발용
    } else if (userRole !== required) {
        console.log("접근 거부.");
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
