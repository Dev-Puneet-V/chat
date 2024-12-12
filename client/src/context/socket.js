import socketio from "socket.io-client";
import React from "react";
import { API_URL } from "../contant";
const SOCKET_URL = API_URL;
export const socket = socketio.connect(SOCKET_URL, { withCredentials: true });
export const SocketContext = React.createContext();
