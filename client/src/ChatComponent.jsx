import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Connect to the server

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for the 'welcome' event from the server
    socket.on("welcome", (message) => {
      console.log(message); // Logs: "Welcome to the server!"
    });

    // Listen for messages from the server
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("welcome");
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    // Send a message to the server
    socket.emit("message", "Hello from the client!");
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
