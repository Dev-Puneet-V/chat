const Home = () => {
  return (
    <div className="w-[100%] background">
      <div className="h-[70px] bg-indigo-400 w-[100%] flex justify-between items-center p-[10px]">
        <input className="h-[40px]" />
        <button className="bg-indigo-500 rounded-xl w-[75px] p-[5px] font-bold">
          Logout
        </button>
      </div>
      <div className="w-[100%] h-[90vh] flex">
        <div className="bg-indigo-300 w-[300px] h-[100%]"></div>
        <div className="w-[calc(100%-300px)] bg-stone-300 h-[100%]"></div>
      </div>
    </div>
  );
};

export default Home;
