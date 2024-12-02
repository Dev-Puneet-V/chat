import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div
      style={{
        maxHeight: "300px",
        overflowY: "auto",
        margin: "20px auto",
        width: "80%",
        border: "1px solid #ddd",
        padding: "10px",
      }}
    >
      <ul style={{ listStyleType: "none", padding: "0" }}>
        {messages.map((msg, index) => (
          <li key={index} style={{ margin: "10px 0", textAlign: "left" }}>
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
