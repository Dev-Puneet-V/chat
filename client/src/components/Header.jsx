const Header = ({
  searchBy,
  logoutHandler,
  queryHandler,
  queryOptionsHandler,
  queryRef,
}) => {
  return (
    <div className="h-[70px] bg-indigo-400 w-[100%] flex justify-between items-center p-[10px]">
      <div className="flex">
        <input
          ref={queryRef}
          className="h-[40px] w-[200px] px-4 border-2 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm"
          placeholder={"Search by " + searchBy}
          onChange={queryHandler}
        />
        <select className="rounded-r-lg" onChange={queryOptionsHandler}>
          <option>By group</option>
          <option>By user</option>
        </select>
      </div>
      <button
        onClick={logoutHandler}
        className="bg-indigo-500 rounded-xl w-[75px] p-[5px] font-bold"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
