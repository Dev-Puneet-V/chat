import React, { useContext, useEffect, useState } from "react";
import Chat from "./ChatComponent";
import { SocketContext } from "./context/socket";
import Auth from "./components/Auth";
import Home from "./components/Home";
import CreateGroup from "./components/CreateGroup";
import Modal from "./components/Modal";

const App = () => {
  const socket = useContext(SocketContext);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const toggleLogin = () => {
    setLoggedIn(!isLoggedIn);
  };
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to WebSocket");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket");
      });

      return () => {
        // console.log("component unrendered");
        // socket.disconnect();
      };
    }
  }, [socket]);
  return (
    <div>
      {!isLoggedIn && <Auth toogleLoggedIn={toggleLogin} />}
      {/* <h1>React Chat App</h1> */}
      {/* <Chat /> */}
      {isLoggedIn && <Home />}
    </div>
  );
};

export default App;
