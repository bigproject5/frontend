import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSuccess, setInitializing } from '../store/authSlice';
import { fetchCurrentUser } from '../Api/phm_api.jsx';

const AppInitializer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadUser() {
      // 초기화 시작을 Redux에 알림
      const curPath = location.pathname;
      if(curPath === "/login" || curPath === "/signup" || curPath === "/admin-login") return;
      dispatch(setInitializing(true));

      try {


        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          dispatch(setInitializing(false));
          navigate("/login");
          return;
        }

        const response = await fetchCurrentUser(token);
        if (!response) throw new Error("토큰 만료 혹은 인증 실패");

        const userRole = response.role;
        const taskType = response.taskType;
        dispatch(loginSuccess({ user: response, role: userRole, taskType: taskType })); // taskType도 함께 전달

      } catch (error) {
        console.error(error);
        sessionStorage.removeItem("accessToken"); // 잘못된 토큰 제거
        navigate("/login");
      } finally {
        dispatch(setInitializing(false));
      }
    }

    loadUser();
  }, [dispatch, navigate, location]);

  return null;
};

export default AppInitializer;