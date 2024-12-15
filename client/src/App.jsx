import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "./context/socket";
import Auth from "./components/Auth";
import Home from "./components/Home";
import axios from "axios";
import { API_URL } from "./contant";
import { Provider } from "react-redux";
import store from "./store/store";
const App = () => {
  const socket = useContext(SocketContext);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const toggleLogin = () => {
    setLoggedIn(!isLoggedIn);
  };
  const handleLogOut = async () => {
    try {
      const response = await axios.get(API_URL + `/api/auth/logout`, {
        withCredentials: true,
      });
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

      return () => {};
    }
  }, [socket]);

  return (
    <Provider store={store}>
      <div>
        {!isLoggedIn && <Auth toogleLoggedIn={toggleLogin} />}
        {isLoggedIn && <Home logoutHandler={handleLogOut} />}
      </div>
    </Provider>
  );
};

export default App;
