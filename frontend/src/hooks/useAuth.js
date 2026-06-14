import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../features/auth/authSlice.js";

const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  return { user, token, isAuthenticated: Boolean(user) };
};

export default useAuth;
