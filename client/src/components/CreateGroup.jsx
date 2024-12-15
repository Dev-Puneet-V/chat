import axios from "axios";
import { useRef } from "react";
import { API_URL } from "../contant";
import { useDispatch, useSelector } from "react-redux";
import { setHistory } from "../store/dataSlice";
const CreateGroup = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { history } = useSelector((state) => state.data);
  const inputRef = useRef("");
  const handleCreateGroup = async () => {
    const groupName = inputRef.current.value;
    const response = await axios.post(
      API_URL + "/api/group",
      {
        name: groupName,
      },
      {
        withCredentials: true,
      }
    );
    inputRef.current = "";
    if (response.data.success) {
      console.log("group successfully created");
      onSuccess();
      let newHistory = {
        ...history,
        group: [
          ...history["group"],
          { ...response.data.data[0], isMember: true },
        ],
      };
      console.log(newHistory);
      dispatch(setHistory(newHistory));
    } else {
      //Handle error
      console.log(response.data.message);
    }
  };
  return (
    <div className="fixed h-auto w-[200px] gap-2">
      {/* <label className="mt-[5px]">Name of the group</label> */}
      <input
        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter group name"
        ref={inputRef}
      />
      <div
        className="mt-[20px] bg-indigo-400 rounded-md font-bold p-[5px] text-center w-[150px] cursor-pointer"
        onClick={handleCreateGroup}
      >
        Create group
      </div>
    </div>
  );
};

export default CreateGroup;
