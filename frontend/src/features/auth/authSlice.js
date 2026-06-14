import { createSlice } from "@reduxjs/toolkit";

const getPersistedUser = () => {
  try {
    const raw = localStorage.getItem("splitwiseAuthUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const savePersistedUser = (user) => {
  try {
    if (user) {
      localStorage.setItem("splitwiseAuthUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("splitwiseAuthUser");
    }
  } catch {
    // ignore localStorage errors
  }
};

const initialState = {
  user: getPersistedUser(),
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.status = "succeeded";
      state.error = null;
      savePersistedUser(action.payload.user);
    },
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
      savePersistedUser(null);
    },
    setLoading(state) {
      state.status = "loading";
      state.error = null;
    },
    setError(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setCredentials, logout, setLoading, setError, clearError } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
