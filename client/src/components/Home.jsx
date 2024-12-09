import { useState, useEffect } from "react";
import Modal from "./Modal";
import CreateGroup from "./CreateGroup";
import axios from "axios";
import ChatBox from "./ChatBox";

const Home = () => {
  const [createGroupModalStatus, setCreateGroupModalStatus] = useState(false);
  const [searchBy, setSearchBy] = useState("group");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentSelectedChatBox, setCurrectSelectedChatBox] = useState(0);
  const toogleModal = () => {
    setCreateGroupModalStatus(!createGroupModalStatus);
  };
  const handleChange = (event) => {
    setSearchBy(event.target.value.split(" ")[1]);
  };

  const handleJoinGroup = async (groupId, index) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/group/join/${groupId}`,
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
        setFilteredData(newFilteredData);
        setCurrectSelectedChatBox(index + 1);
      } else {
        console.error("Request failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Triggered after 3 seconds of inactivity
    const handler = setTimeout(() => {
      if (query.length >= 3) {
        setDebouncedQuery(query);
      }
    }, 1000);

    return () => {
      clearTimeout(handler); // Clear timeout on input change
    };
  }, [query]);

  useEffect(() => {
    // Only run this effect if debouncedQuery changes
    if (debouncedQuery) {
      const fetchData = async () => {
        try {
          //TODO:1 - filter by user using searchBy
          if (searchBy === "group") {
            const response = await axios.get(
              `http://localhost:3000/api/group/filter?grpName=${debouncedQuery}`,
              { withCredentials: true }
            );
            if (response.data.success) {
              console.log(response.data.data);
              //TODO:3 - adjust this such that it is valid for user as well
              setFilteredData([...response.data.data]);
            } else {
              console.error("Request failed");
            }
          } else {
            const response = await axios.get(
              `http://localhost:3000/api/user/filter?userName=${debouncedQuery}`,
              { withCredentials: true }
            );
            if (response.data.success) {
              console.log(response.data.data);
              //TODO:3 - adjust this such that it is valid for user as well
              setFilteredData([...response.data.data]);
            } else {
              console.error("Request failed");
            }
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchData();
    }
  }, [debouncedQuery]);
  return (
    <div className="w-[100%] background">
      <div className="h-[70px] bg-indigo-400 w-[100%] flex justify-between items-center p-[10px]">
        <div className="flex">
          <input
            className="h-[40px] w-[200px] px-4 border-2 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm"
            placeholder={"Search by " + searchBy}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className="rounded-r-lg" onChange={handleChange}>
            <option>By group</option>
            <option>By user</option>
          </select>
        </div>
        <button className="bg-indigo-500 rounded-xl w-[75px] p-[5px] font-bold">
          Logout
        </button>
      </div>
      <div className="w-[100%] h-[90vh] flex">
        <div className="bg-indigo-300 w-[300px] h-[100%]">
          <div className="h-[calc(100%-55px)]">
            {filteredData?.map((currData, index) => {
              return (
                <div
                  key={currData._id}
                  className={`flex justify-between items-center h-[50px] p-[10px] w-[95%] bg-white m-[5px] cursor-pointer font-bold ${
                    currData?.isMember ? "hover:bg-indigo-500" : ""
                  } rounded-md`}
                  onClick={() => {
                    if (currData?.isMember) {
                      setCurrectSelectedChatBox(index + 1);
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
          <div className="hover:bg-indigo-600 cursor-pointer h-[50px] w-[80%] m-auto rounded-[10px] bg-indigo-500 flex justify-center items-center">
            <p className="font-bold mb-[5px]" onClick={toogleModal}>
              Create a group +
            </p>
          </div>
        </div>
        <div className="w-[calc(100%-300px)] bg-stone-300 h-[100%]">
          {currentSelectedChatBox ? (
            <ChatBox
              index={currentSelectedChatBox}
              data={filteredData}
              type={searchBy}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      {createGroupModalStatus && (
        <Modal handleModal={toogleModal}>
          <CreateGroup onSuccess={toogleModal} />
        </Modal>
      )}
    </div>
  );
};

export default Home;
