import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSuccess, setInitializing } from '../store/authSlice';
import { fetchCurrentUser } from '../Api/phm_api.jsx';

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isInitializing = useSelector((state) => state.auth.isInitializing);
  const initialLoadComplete = useRef(false);

  useEffect(() => {
    async function loadUser() {
      const curPath = location.pathname;
      if (curPath === "/login" || curPath === "/signup" || curPath === "/admin-login") {
        if (initialLoadComplete.current === false) {
          dispatch(setInitializing(false));
          initialLoadComplete.current = true;
        }
        return;
      }

      if (!initialLoadComplete.current) {
        dispatch(setInitializing(true));
      }

      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetchCurrentUser(token);
        if (!response) throw new Error("토큰 만료 혹은 인증 실패");

        dispatch(loginSuccess({ user: response, role: response.role, taskType: response.taskType }));

      } catch (error) {
        console.error(error);
        sessionStorage.removeItem("accessToken");
        navigate("/login");
      } finally {
        if (!initialLoadComplete.current) {
          dispatch(setInitializing(false));
          initialLoadComplete.current = true;
        }
      }
    }

    loadUser();
  }, [dispatch, navigate, location]);

  if (isInitializing && !initialLoadComplete.current) {
    return <div>Loading...</div>;
  }

  return children;
};

export default AppInitializer;
