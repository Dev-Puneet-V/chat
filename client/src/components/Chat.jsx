import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import MessageList from "./MessageList";

// const socket = io("http://localhost:3000"); // Connect to backend

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // socket.on("chat message", (msg) => {
    //   setMessages((prevMessages) => [...prevMessages, msg]);
    // });

    return () => {
      // socket.disconnect();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit("chat message", input);
      setInput("");
    }
  };

  return (
    <div>
      <MessageList messages={messages} />
      <form onSubmit={handleSendMessage} style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          style={{ padding: "10px", width: "70%" }}
        />
        <button type="submit" style={{ padding: "10px" }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
