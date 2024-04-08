import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AccountContext } from "./AccountContext";
const useAuth = () => {
  const { user } = useContext(AccountContext);
  return user && user.loggedIn;
};
const PrivateRoutes = ({ children }) => {
  const user = useAuth();
  return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
