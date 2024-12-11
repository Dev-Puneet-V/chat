import { useEffect, useRef } from "react";

const ChatMessages = ({ messages }) => {
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      const lastChild = chatContainerRef.current.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);
  return (
    <div className="p-[10px] h-[calc(100%-150px)] overflow-y-scroll no-scrollbar">
      {messages?.map((currChat) => (
        <div
          ref={chatContainerRef}
          key={currChat?._id}
          className="m-[10px] bg-violet-400 p-[5px] rounded-md w-auto flex justify-between pl-[10px] pr-[10px]"
        >
          <div>
            <p className="font-bold text-sm">{currChat?.owner?.username}</p>
            <p>{currChat?.content}</p>
          </div>
          <p className="white text-xs pt-[5px]">
            {currChat?.updatedAt?.split("T")[0]}{" "}
            {currChat?.updatedAt?.split("T")[1]?.split(".")[0]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
