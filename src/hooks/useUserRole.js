import { useState, useEffect } from 'react';

// 임시 모킹 데이터 - 실제로는 Redux나 Context에서 가져올 예정
const mockUser = {
  id: 1,
  role: 'WORKER', // 'ADMIN' 또는 'WORKER'
  workerId: 1,
  name: '김작업자'
};

export const useUserRole = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 실제로는 Redux store나 localStorage에서 사용자 정보를 가져옴
    // 현재는 모킹 데이터 사용
    setUser(mockUser);
    setIsAuthenticated(true);
  }, []);

  const isAdmin = () => user?.role === 'ADMIN';
  const isWorker = () => user?.role === 'WORKER';
  const getUserId = () => user?.id;
  const getWorkerId = () => user?.workerId;

  return {
    user,
    isAuthenticated,
    isAdmin,
    isWorker,
    getUserId,
    getWorkerId
  };
};
