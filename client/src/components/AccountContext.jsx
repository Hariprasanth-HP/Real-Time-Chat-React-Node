import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const AccountContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: null });
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/auth/login", {
      credentials: "include",
    })
      .catch((err) => {
        setUser({ loggedIn: false });
      })
      .then((res) => {
        if (!res || !res.ok || res.status >= 400) {
          setUser({ loggedIn: false });
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) {
          setUser({ loggedIn: false });
          return;
        }
        setUser({ ...data });
        navigate("/home");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log("dataaa", user);
  return (
    <AccountContext.Provider value={{ user, setUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;
