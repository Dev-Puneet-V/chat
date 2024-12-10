import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { SocketContext } from "../context/socket";
const ChatBox = ({ index, data, type }) => {
  const [chatData, setChatData] = useState();
  const messageRef = useRef("");
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.on("new-message-group", async (data, ack) => {
      console.log("new-message-group", data);
      const { chat, groupId, user, user1Id, user2Id } = data;
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

    return () => {
      socket.off("new-message-group");
      console.log("Socket listener removed");
    };
  }, []);
  useEffect(() => {
    console.log("JRIRIRKR", chatData);
  }, [chatData]);
  useEffect(() => {
    const key = Object.keys(data[index - 1])[0];
    console.log("jfiiIRIRJJR", key, data[index - 1]);
    const selectedUserId = data[index - 1][key];
    console.log("DATAAAA", chatData, type);
    if (chatData && type === "user") {
      console.log("Inside data");
      socket.emit("join-one-to-one", {
        selectedUserId: selectedUserId,
      });
    }
    return () => {
      console.log("First clean up", chatData);
      if (chatData && type === "user") {
        console.log("Removed");
        // socket.emit("leave-one-to-one", {
        //   selectedUserId: selectedUserId,
        // });
      }
      // socket.off("new-message-group");
      console.log("Socket listener removed");
    };
  }, [chatData]);
  const handleChatBox = async (currData) => {
    try {
      const response = await axios.get(
        type === "group"
          ? "http://localhost:3000/api/chat/info/group/" + currData?._id
          : "http://localhost:3000/api/chat/info/user/" + currData?._id,
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
  useEffect(() => {
    console.log("Just changed", chatData);
  }, [chatData]);
  const handleNewConvo = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/chat/initiate/" + data[index - 1]._id,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setChatData({ [data[index - 1]._id]: response.data.data });
      }
    } catch (error) {
      console.log(error);
      console.error("Error initiating:");
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
            {chatData && chatData[data[index - 1]?._id]?.group?.name}
          </div>
          <div className="p-[10px] h-[calc(100%-150px)] overflow-y-scroll">
            {chatData &&
              chatData[data[index - 1]?._id]?.messages?.map(
                (currChat, index) => {
                  return (
                    <div
                      className="m-[10px] bg-violet-400 p-[5px] rounded-md w-auto flex justify-between pl-[10px] pr-[10px]"
                      key={currChat?._id}
                    >
                      <div>
                        <p className="font-bold text-sm">
                          {currChat?.owner?.username}
                        </p>
                        <p>{currChat?.content}</p>
                      </div>
                      <p className="white text-xs pt-[5px]">
                        {currChat?.updatedAt?.split("T")[0] +
                          " " +
                          currChat?.updatedAt?.split("T")[1]?.split(".")[0]}
                      </p>
                    </div>
                  );
                }
              )}
          </div>
          <div className="absolute bottom-2 w-[100%] left-0 flex justify-center">
            <input
              ref={messageRef}
              placeholder="Enter the message..."
              className="w-[calc(100%-150px)] h-10 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div
              onClick={sendMessage}
              className="cursor-pointer flex justify-center items-center rounded-md ml-[5px] bg-indigo-500 font-bold w-[100px]"
            >
              Send
            </div>
          </div>
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
