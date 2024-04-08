import React, { useContext, useEffect } from "react";
import socket from "../../socket";
import { AccountContext } from "../AccountContext";
const useSocketHook = (setFriendList) => {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();
    alert("test");
    socket.on("friends", (friendList) => {
      console.log("friendList", friendList);
      setFriendList(friendList);
    });
    socket.on("connect_error", () => {
      setUser({ loggedIn: false });
    });

    return () => {
      socket.off("connect_error");
    };
  }, [setUser, setFriendList]);
};

export default useSocketHook;
