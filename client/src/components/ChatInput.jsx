const ChatInput = ({ typingUser, messageRef, sendMessage }) => {
  return (
    <div className="absolute bottom-2 w-[100%] left-0 flex justify-center">
      {typingUser && (
        <p className="text-xs font-bold absolute top-[-16px] left-[25px]">
          {typingUser} is typing...
        </p>
      )}
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
  );
};

export default ChatInput;
