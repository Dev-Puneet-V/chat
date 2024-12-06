import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { SocketContext } from "../context/socket";
const ChatBox = ({ index, data }) => {
  const [chatData, setChatData] = useState();
  const messageRef = useRef("");
  const socket = useContext(SocketContext);
  const handleChatBox = async (currData) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/chat/info/group/" + currData?._id,
        { withCredentials: true }
      );
      if (response.data.success) {
        setChatData(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error.message || "Error fetching chat");
    }
  };

  const sendMessage = () => {
    const messageData = {
      message: messageRef.current?.value,
      type: "Group",
      groupId: data[index - 1]._id,
    };
    socket.emit("new-message", messageData, (response) => {
      messageRef.current.value = "";
      if (response.success) {
        setChatData((prevChatData) => ({
          ...prevChatData,
          messages: [...response.data.messages],
        }));
      } else {
        console.error("Error creating user:", response.message);
      }
    });
  };

  useEffect(() => {
    handleChatBox(data[index - 1]);
  }, [index]);
  return (
    <div className="h-[100%] w-[100%] mt-[-10px] relative">
      <div className="h-[70px] w-[100%] bg-white pl-[10px] mt-[10px] mb-[10px] font-bold flex items-center">
        {chatData?.group?.name}
      </div>
      <div className="p-[10px] h-[calc(100%-150px)] overflow-y-scroll">
        {chatData?.messages?.map((currChat, index) => {
          return (
            <div
              className="m-[10px] bg-violet-400 p-[5px] rounded-md w-auto flex justify-between pl-[10px] pr-[10px]"
              key={currChat?._id}
            >
              <div>
                <p className="font-bold text-sm">{currChat?.owner?.username}</p>
                <p>{currChat?.content}</p>
              </div>
              <p className="white text-xs pt-[5px]">
                {currChat?.updatedAt?.split("T")[0] +
                  " " +
                  currChat?.updatedAt?.split("T")[1]?.split(".")[0]}
              </p>
            </div>
          );
        })}
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
  );
};

export default ChatBox;
