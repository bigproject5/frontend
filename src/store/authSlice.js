import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    role: null,
    taskType: null,
    isInitializing: true,
  },
  reducers: {
    setInitializing: (state, action) => {
      state.isInitializing = action.payload;
    },
    loginSuccess: (state, action) => {
      const fullUser = action.payload.user;
      state.isAuthenticated = true;
      state.user = {
        id: fullUser.id,
        name: fullUser.name
      };
      state.role = fullUser.role;
      state.taskType = fullUser.taskType;
      state.isInitializing = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.taskType = null;
      state.isInitializing = false;
    }
  }
});

export const { loginSuccess, logout, setInitializing } = authSlice.actions;
export default authSlice.reducer;
