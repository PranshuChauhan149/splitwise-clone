import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/authSlice.js";

const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
