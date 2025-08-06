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
      if(location.pathname === "/login" || location.pathname === "/signup") return;
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

        const userRole = response.role.toLowerCase();
        dispatch(loginSuccess({ user: response, role: userRole }));

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