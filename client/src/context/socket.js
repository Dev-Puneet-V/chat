import socketio from "socket.io-client";
import React from "react";
const SOCKET_URL = "https://chat-k7m6.onrender.com";
export const socket = socketio.connect(SOCKET_URL, { withCredentials: true });
export const SocketContext = React.createContext();
