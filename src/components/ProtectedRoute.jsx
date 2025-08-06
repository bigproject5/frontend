import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';

// 관리자만 접근 가능한 라우트
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/worker" replace />;
  }

  return children;
};

// 작업자만 접근 가능한 라우트
export const WorkerRoute = ({ children }) => {
  const { isAuthenticated, isWorker } = useUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isWorker()) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

// 인증된 사용자만 접근 가능한 라우트
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
