import React, { useContext, useEffect, useState } from "react";
import Chat from "./ChatComponent";
import { SocketContext } from "./context/socket";
import Auth from "./components/Auth";
import Home from "./components/Home";
import CreateGroup from "./components/CreateGroup";
import Modal from "./components/Modal";
import axios from "axios";

const App = () => {
  const socket = useContext(SocketContext);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const toggleLogin = () => {
    setLoggedIn(!isLoggedIn);
  };
  const handleLogOut = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/auth/logout`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setLoggedIn(false);
      }
    } catch (error) {
      console.log(error.message);
    }
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
      {isLoggedIn && <Home lougoutHandler={handleLogOut} />}
    </div>
  );
};

export default App;
