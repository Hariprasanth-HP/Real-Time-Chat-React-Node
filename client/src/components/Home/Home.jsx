import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import { createContext, useState } from "react";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import useSocketHook from "./useSocketHook";

export const FriendContext = createContext();
export const MessageContext = createContext();

const Home = () => {
  const [friendList, setFriendList] = useState([]);
  const [messages, setMessages] = useState([]);
  useSocketHook(setFriendList, setMessages);
  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <Grid templateColumns="repeat(10, 1fr)" h="100vh" as={Tabs}>
        <GridItem colSpan="3" borderRight="1px solid gray">
          <Sidebar />
        </GridItem>
        <GridItem colSpan="7">
          <MessageContext.Provider value={{ messages, setMessages }}>
            <Chat />
          </MessageContext.Provider>
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
