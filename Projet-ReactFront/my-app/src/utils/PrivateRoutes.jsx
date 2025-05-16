import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoutes = ({ allowedRoles, children }) => {
  const { user, authTokens } = useContext(AuthContext);   const location = useLocation();

  if (!user && !authTokens) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return allowedRoles.includes(user.role) ? (
    <Outlet/>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default PrivateRoutes;


