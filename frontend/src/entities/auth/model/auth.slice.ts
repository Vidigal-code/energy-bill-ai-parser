import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthUser } from './auth.types';

const initialState: AuthState = {
  user: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.initialized = true;
    },
    clearAuthUser(state) {
      state.user = null;
      state.initialized = true;
    },
    markInitialized(state) {
      state.initialized = true;
    },
  },
});

export const { setAuthUser, clearAuthUser, markInitialized } = authSlice.actions;
export const authReducer = authSlice.reducer;
