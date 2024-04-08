import { Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import SignUp from "./Login/SignUp";
import PrivateRoutes from "./PrivateRoutes";
import { useContext } from "react";
import { AccountContext } from "./AccountContext";
import Home from "./Home/Home";

const Views = () => {
  const { user } = useContext(AccountContext);
  console.log("userlogged", user);
  return user.loggedIn === null ? (
    <h1>Loading</h1>
  ) : (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default Views;
