import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/apiService.js";
import { setCredentials, logout, setLoading, setError } from "../features/auth/authSlice.js";
import api from "../utils/axiosInstance.js";

export const useAuthActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (values) => {
    try {
      dispatch(setLoading());
      const response = await authApi.login(values);
      dispatch(setCredentials({ user: response.data.data.user }));
      navigate("/");
    } catch (error) {
      dispatch(setError(error.error || error.message || "Login failed"));
    }
  };

  const register = async (values) => {
    try {
      dispatch(setLoading());
      const response = await authApi.register(values);
      dispatch(setCredentials({ user: response.data.data.user }));
      navigate("/");
    } catch (error) {
      dispatch(setError(error.error || error.message || "Registration failed"));
    }
  };

  const logoutUser = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore silent failure
    }
    dispatch(logout());
    api.defaults.headers.common.Authorization = undefined;
    navigate("/auth/login");
  };

  return { login, register, logoutUser };
};
