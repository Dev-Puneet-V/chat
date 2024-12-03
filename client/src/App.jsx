import React, { useContext, useEffect } from "react";
import io from "socket.io-client";
import Chat from "./ChatComponent";
import { SocketContext } from "./context/socket";
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
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>React Chat App</h1>
      <Chat />
    </div>
  );
};

export default App;
