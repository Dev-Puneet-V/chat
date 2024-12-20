import { useState, useEffect, useRef, useContext } from "react";
import Modal from "./Modal";
import CreateGroup from "./CreateGroup";
import axios from "axios";
import ChatBox from "./ChatBox";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { API_URL } from "../contant";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../store/dataSlice";
import { SocketContext } from "../context/socket";
import { setHistory, setFilteredData } from "../store/dataSlice";
const Home = ({ logoutHandler }) => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const queryRef = useRef("");
  const [createGroupModalStatus, setCreateGroupModalStatus] = useState(false);
  const [searchBy, setSearchBy] = useState("group");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  // const [filteredData, setFilteredData] = useState([]);
  const [currentSelectedChatBox, setCurrentSelectedChatBox] = useState(0);
  // const [history, setHistory] = useState({});
  const { history, filteredData, status } = useSelector((state) => state.data);
  const toogleModal = () => {
    socket.emit("initialize-user", {});
    setCreateGroupModalStatus(!createGroupModalStatus);
  };
  const handleChange = (event) => {
    setSearchBy(event.target.value.split(" ")[1]);
  };
  useEffect(() => {
    // const fetchData = async () => {
    // try {
    //   if (filteredData?.length === 0) {
    //     const response = await axios.get(`${API_URL}/api/user/history`, {
    //       withCredentials: true,
    //     });
    //     if (response.data.success) {
    //       setHistory({
    //         ...history,
    //         ...response.data.data,
    //       });
    //       // setFilteredData([...response.data.data["group"]]);
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error fetching data:", error); // Log the error for debugging
    // }
    // };
    // fetchData();
    dispatch(fetchHistory());
  }, []);
  useEffect(() => {
    dispatch(setFilteredData([]));
    setQuery("");
    setCurrentSelectedChatBox(0);
  }, [searchBy]);

  useEffect(() => {
    if (query.length === 0 && history[searchBy]) {
      dispatch(setFilteredData(history[searchBy]));
    }
  }, [query, history, searchBy]);

  useEffect(() => {
    // Triggered after 2 seconds of inactivity
    const handler = setTimeout(() => {
      if (query.length >= 3) {
        setDebouncedQuery(query);
      } else {
        // fetchData();
        // setFilteredData([]);
      }
      setCurrentSelectedChatBox(0);
    }, 2000);

    return () => {
      clearTimeout(handler); // Clear timeout on input change
    };
  }, [query]);

  useEffect(() => {
    // Only run this effect if debouncedQuery changes
    if (debouncedQuery) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            API_URL +
              `/api/${
                searchBy === "group"
                  ? "group/filter?grpName"
                  : "user/filter?userName"
              }=${debouncedQuery}`,
            { withCredentials: true }
          );
          if (response.data.success) {
            dispatch(setFilteredData([...response.data.data]));
          } else {
            console.error("Request failed");
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchData();
    }
  }, [debouncedQuery]);
  const handleQuery = (event) => {
    setQuery(event.target.value);
  };
  return (
    <div className="w-[100%] background">
      <Header
        logoutHandler={logoutHandler}
        queryHandler={handleQuery}
        queryOptionsHandler={handleChange}
        queryRef={queryRef}
        searchBy={searchBy}
      />

      <div className="w-[100%] h-[90vh] flex">
        <Sidebar
          filteredData={filteredData}
          setCurrentSelectedChatBox={setCurrentSelectedChatBox}
          toogleModal={toogleModal}
          // setFilteredData={setFilteredData}
        />
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
