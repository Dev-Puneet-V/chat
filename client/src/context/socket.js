import socketio from "socket.io-client";
import React from "react";
const SOCKET_URL = "http://localhost:3000";
export const socket = socketio.connect(SOCKET_URL, { withCredentials: true });
export const SocketContext = React.createContext();
