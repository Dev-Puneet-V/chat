import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { SocketContext } from "../context/socket";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import { API_URL } from "../contant";
const ChatBox = ({ index, data, type }) => {
  const [chatData, setChatData] = useState();
  const [typingUser, setTypingUser] = useState();
  const messageRef = useRef("");
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.on("new-message-group", async (data, ack) => {
      const { chat, groupId, user, user1Id, user2Id } = data;
      console.log("EMITTED", groupId);
      setChatData((prevChatData) => ({
        ...prevChatData,
        [groupId ? groupId : user1Id]: {
          ...(prevChatData[groupId] || {}), // Keep other properties of the group intact
          messages: chat?.messages ? [...chat.messages] : [], // Update the messages
        },
        [groupId ? groupId : user2Id]: {
          ...(prevChatData[groupId] || {}), // Keep other properties of the group intact
          messages: chat?.messages ? [...chat.messages] : [], // Update the messages
        },
      }));
    });
    socket.on("is-typing", (data) => {
      const { user } = data;
      setTypingUser(user);
    });
    socket.on("stopped-typing", (data) => {
      setTypingUser();
    });

    return () => {
      socket.off("new-message-group");
    };
  }, []);
  useEffect(() => {
    if (chatData) {
      console.log(
        "DEBUG chat data",
        chatData,
        index - 1,
        data[index - 1],
        chatData[data[index - 1]?._id]
      );
    }
  }, [chatData]);
  useEffect(() => {
    const key = Object.keys(data[index - 1])[0];
    const selectedUserId = data[index - 1][key];
    if (chatData && type === "user") {
      socket.emit("join-one-to-one", {
        selectedUserId: selectedUserId,
      });
    }
  }, [chatData]);
  const handleChatBox = async (currData) => {
    try {
      const response = await axios.get(
        type === "group"
          ? API_URL + "/api/chat/info/group/" + currData?._id
          : API_URL + "/api/chat/info/user/" + currData?._id,
        { withCredentials: true }
      );
      if (type === "group") {
        if (response.data.success) {
          setChatData({ [currData?._id]: response.data.data });
        } else {
          throw new Error(response.data.message);
        }
      } else {
        if (response.data.success) {
          if (!response.data?.data) {
            setChatData(null);
          } else {
            setChatData({ [currData?._id]: response.data.data });
          }
        } else {
          throw new Error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error.message || "Error fetching chat");
    }
  };

  const sendMessage = () => {
    const messageData = {
      message: messageRef.current?.value,
      type: type === "group" ? "Group" : "User",
      groupId: data[index - 1]._id,
    };
    socket.emit("new-message", messageData, (response) => {
      messageRef.current.value = "";
      if (response.success) {
        // setChatData((prevChatData) => ({
        //   ...prevChatData,
        //   messages: [...response.data.messages],
        // }));
      } else {
        console.error("Error creating user:");
      }
    });
  };

  const handleNewConvo = async () => {
    try {
      const response = await axios.post(
        API_URL + "/api/chat/initiate/" + data[index - 1]._id,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setChatData({ [data[index - 1]._id]: response.data.data });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleChatBox(data[index - 1]);
  }, [index]);

  return (
    <>
      {!index && <div className="h-[100%] w-[100%] mt-[-10px] relative"></div>}
      {chatData && index && (
        <div className="h-[100%] w-[100%] mt-[-10px] relative">
          <div className="h-[70px] w-[100%] bg-white pl-[10px] mt-[10px] mb-[10px] font-bold flex items-center">
            {(chatData && data[index - 1]?.name) ||
              chatData[data[index - 1]?._id]?.group?.name}
          </div>
          <ChatMessages messages={chatData[data[index - 1]?._id]?.messages} />
          <ChatInput
            chatInputHandler={(e) => {
              console.log(e.target.value);
              socket.emit("typing", {
                groupId: data[index - 1]?._id,
              });
              setTimeout(() => {
                socket.emit("stop-typing", {
                  groupId: data[index - 1]?._id,
                });
              }, 500);
            }}
            typingUser={typingUser}
            messageRef={messageRef}
            sendMessage={sendMessage}
          />
        </div>
      )}
      {!chatData && index && (
        <div className="h-[100%] w-[100%] mt-[-10px] relative flex justify-center items-center">
          <button
            className="rounded-xl bg-indigo-500 p-[10px] font-bold"
            onClick={handleNewConvo}
          >
            Send your first message
          </button>
        </div>
      )}
    </>
  );
};

export default ChatBox;
