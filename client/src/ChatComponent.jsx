import { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { SocketContext } from "./context/socket";
const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const socket = useContext(SocketContext);

  const sendMessage = () => {
    const newUser = {
      username: "Puneet",
      password: "Puneet@123",
    };
    socket.emit("create-user", newUser, (response) => {
      if (response.success) {
        console.log("User created successfully:", response.user);
      } else {
        console.error("Error creating user:", response.message);
      }
    });
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default ChatComponent;
