const ChatMessages = ({ messages }) => {
  return (
    <div className="p-[10px] h-[calc(100%-150px)] overflow-y-scroll">
      {messages?.map((currChat) => (
        <div
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
