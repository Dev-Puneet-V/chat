import { useState } from "react";
import Modal from "./Modal";
import CreateGroup from "./CreateGroup";

const Home = () => {
  const [createGroupModalStatus, setCreateGroupModalStatus] = useState(false);
  const toogleModal = () => {
    setCreateGroupModalStatus(!createGroupModalStatus);
  };
  return (
    <div className="w-[100%] background">
      <div className="h-[70px] bg-indigo-400 w-[100%] flex justify-between items-center p-[10px]">
        <input className="h-[40px]" />
        <button className="bg-indigo-500 rounded-xl w-[75px] p-[5px] font-bold">
          Logout
        </button>
      </div>
      <div className="w-[100%] h-[90vh] flex">
        <div className="bg-indigo-300 w-[300px] h-[100%]">
          <div className="h-[calc(100%-55px)]"></div>
          <div className="hover:bg-indigo-600 cursor-pointer h-[50px] w-[80%] m-auto rounded-[10px] bg-indigo-500 flex justify-center items-center">
            <p className="font-bold mb-[5px]" onClick={toogleModal}>
              Create a group +
            </p>
          </div>
        </div>
        <div className="w-[calc(100%-300px)] bg-stone-300 h-[100%]"></div>
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
