import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/authSlice.js";

const PublicRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PublicRoute;
