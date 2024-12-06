import { useEffect, useState } from "react";
import axios from "axios";
const ChatBox = ({ index, data }) => {
  const [chatData, setChatData] = useState();
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

  useEffect(() => {
    console.log("hello");
    handleChatBox(data[index - 1]);
  }, [index]);
  return (
    <div className="h-[100%] w-[100%] mt-[-10px]">
      <div className="h-[70px] w-[100%] bg-white pl-[10px] mt-[10px] mb-[10px] font-bold flex items-center">
        {chatData?.group?.name}
      </div>
      <div className="p-[10px]">
        {chatData?.messages?.map((currChat, index) => {
          return (
            <div className="m-[10px]" key={currChat?._id}>
              <p>{currChat?.owner?.username}</p>
              <p>{currChat?.content}</p>
              <p>{currChat?.updatedAt}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatBox;
