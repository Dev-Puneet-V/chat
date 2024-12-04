import React, { useContext, useEffect } from "react";
import Chat from "./ChatComponent";
import { SocketContext } from "./context/socket";
import Auth from "./components/Auth";
import Home from "./components/Home";

const App = () => {
  const socket = useContext(SocketContext);
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
      {/* <Auth /> */}
      {/* <h1>React Chat App</h1> */}
      {/* <Chat /> */}
      <Home />
    </div>
  );
};

export default App;
