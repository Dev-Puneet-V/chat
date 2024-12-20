import { API_URL } from "../contant";
import axios from "axios";
import { SocketContext } from "../context/socket";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilteredData } from "../store/dataSlice";
const Sidebar = ({
  // filteredData,
  // setFilteredData,
  setCurrentSelectedChatBox,
  toogleModal,
}) => {
  const dispatch = useDispatch();
  const { filteredData, status } = useSelector((state) => state.data);
  const socket = useContext(SocketContext);
  const handleJoinGroup = async (groupId, index) => {
    try {
      const response = await axios.post(
        API_URL + `/api/group/join/${groupId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        const newFilteredData = filteredData?.map((currData, index) => {
          if (currData._id + "" === groupId) {
            return {
              ...currData,
              isMember: true,
            };
          }
          return currData;
        });
        dispatch(setFilteredData(newFilteredData));
        setCurrentSelectedChatBox(index + 1);
        socket.emit("initialize-user", {});
      } else {
        console.error("Request failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-indigo-300 w-[300px] h-[100%]">
      <div className="h-[calc(100%-65px)] overflow-y-scroll no-scrollbar">
        {filteredData?.map((currData, index) => {
          return (
            <div
              key={currData._id}
              className={`flex justify-between items-center h-[50px] p-[10px] w-[95%] bg-white m-[5px] cursor-pointer font-bold ${
                currData?.isMember ? "hover:bg-indigo-500" : ""
              } rounded-md`}
              onClick={() => {
                if (currData?.isMember) {
                  setCurrentSelectedChatBox(index + 1);
                }
              }}
            >
              <p>{currData.name}</p>
              {!currData?.isMember && (
                <button
                  onClick={() => handleJoinGroup(currData?._id, index)}
                  className="font-bold rounded-md p-[5px] w-[110px] text-slate-200 hover:bg-indigo-400 bg-indigo-500 "
                >
                  Join group
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-[10px] hover:bg-indigo-600 cursor-pointer h-[50px] w-[80%] m-auto rounded-[10px] bg-indigo-500 flex justify-center items-center">
        <p className="font-bold mb-[5px]" onClick={toogleModal}>
          Create a group +
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
