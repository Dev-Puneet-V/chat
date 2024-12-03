import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SocketContext, socket } from "./context/socket.js";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketContext.Provider value={socket}>
      <App />
    </SocketContext.Provider>
  </StrictMode>
);
