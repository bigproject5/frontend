import { useState, useEffect } from 'react';

export const useUserRole = () => {
  // 개발 모드에서는 초기값을 true로 설정
  const isDevelopment = true; // 개발 완료 시 false로 변경

  // 초기값을 URL 기반으로 설정
  const getInitialRole = () => {
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/worker')) {
      return 'worker';
    } else if (currentPath.startsWith('/admin')) {
      return 'admin';
    }
    return 'admin'; // 기본값
  };

  const initialRole = isDevelopment ? getInitialRole() : null;
  const [user, setUser] = useState(
    isDevelopment
      ? { role: initialRole, id: 1, name: `Test ${initialRole === 'admin' ? 'Admin' : 'Worker'}` }
      : null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(isDevelopment);

  useEffect(() => {
    if (isDevelopment) {
      // 현재 URL에 따라 역할 설정
      const currentPath = window.location.pathname;
      let role = 'admin'; // 기본값

      if (currentPath.startsWith('/worker')) {
        role = 'worker';
      } else if (currentPath.startsWith('/admin')) {
        role = 'admin';
      }

      setUser({
        role: role,
        id: 1,
        name: `Test ${role === 'admin' ? 'Admin' : 'Worker'}`
      });
      setIsAuthenticated(true);
      return;
    }

    // 실제 인증 로직 (개발 완료 시 사용)
    const token = sessionStorage.getItem('accessToken');
    const userRole = sessionStorage.getItem('userRole');
    const userInfo = sessionStorage.getItem('userInfo');

    if (token && userRole) {
      const parsedUserInfo = userInfo ? JSON.parse(userInfo) : {};
      setUser({
        role: userRole,
        id: parsedUserInfo.id || 1,
        name: parsedUserInfo.name || 'User'
      });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [window.location.pathname]); // pathname이 변경될 때마다 역할 재설정

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isWorker = () => {
    return user?.role === 'worker';
  };

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userInfo');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    isWorker,
    logout
  };
};
