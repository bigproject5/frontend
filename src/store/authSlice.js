import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    role: null,
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
      state.isInitializing = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.isInitializing = false;
    }
  }
});

export const { loginSuccess, logout, setInitializing } = authSlice.actions;
export default authSlice.reducer;
