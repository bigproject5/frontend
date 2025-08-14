import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    role: null,
    taskType: null, // taskType 필드 추가
    isInitializing: true, // 초기값을 true로 설정
  },
  reducers: {
    setInitializing: (state, action) => {
      state.isInitializing = action.payload;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.taskType = action.payload.taskType; // taskType 상태 업데이트
      state.isInitializing = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.taskType = null; // 로그아웃 시 taskType도 초기화
      state.isInitializing = false;
    }
  }
});

export const { loginSuccess, logout, setInitializing } = authSlice.actions;
export default authSlice.reducer;
