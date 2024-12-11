import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import CreateGroup from "./CreateGroup";
import axios from "axios";
import ChatBox from "./ChatBox";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Home = ({ logoutHandler }) => {
  const queryRef = useRef("");
  const [createGroupModalStatus, setCreateGroupModalStatus] = useState(false);
  const [searchBy, setSearchBy] = useState("group");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentSelectedChatBox, setCurrentSelectedChatBox] = useState(0);
  const toogleModal = () => {
    setCreateGroupModalStatus(!createGroupModalStatus);
  };
  const handleChange = (event) => {
    setSearchBy(event.target.value.split(" ")[1]);
  };

  useEffect(() => {
    setFilteredData([]);
    setQuery("");
    setCurrentSelectedChatBox(0);
  }, [searchBy]);

  useEffect(() => {
    // Triggered after 2 seconds of inactivity
    const handler = setTimeout(() => {
      if (query.length >= 3) {
        setDebouncedQuery(query);
      }
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
              `http://localhost:3000/api/${
                searchBy === "group"
                  ? "group/filter?grpName"
                  : "user/filter?userName"
              }=${debouncedQuery}`,
              { withCredentials: true }
            );
            if (response.data.success) {
              setFilteredData([...response.data.data]);
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
          setFilteredData={setFilteredData}
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
