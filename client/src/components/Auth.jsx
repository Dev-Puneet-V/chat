import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socket";
import { API_URL } from "../contant";
import axios from "axios";

const Auth = ({ toogleLoggedIn }) => {
  const [currAuthState, setCurrentAuthState] = useState(0);
  const socket = useContext(SocketContext);

  const [processing, setProcessing] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    setResponseMessage(null);
  }, [username, password, currAuthState]);
  const handleAuthStateChange = (state) => {
    setCurrentAuthState(state);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setResponseMessage(null);
    if (username.trim() && password.trim()) {
      if (currAuthState === 0) {
        setProcessing(true);
        try {
          const response = await axios.post(
            API_URL + "/api/user",
            {
              username,
              password,
            }
          );
          console.log(response.data);
          setProcessing(false);
          if (response.data.success) {
            setCurrentAuthState(1);
          } else {
            throw new Error(response.data.message || "Something went wrong");
          }
        } catch (error) {
          setProcessing(false);
          setResponseMessage("Unable to signup");
        }
      } else {
        setProcessing(true);
        try {
          const response = await axios.post(
            API_URL + "/api/auth/login",
            {
              username: username,
              password: password,
            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setProcessing(false);
          if (response.data.success) {
            console.log("initialize-user");
            socket.emit("initialize-user", {});
            //   setCurrentAuthState(1);
            toogleLoggedIn();
            alert("Is logged in");
          } else {
            throw new Error(response.data.message || "Something went wrong");
          }
        } catch (error) {
          setProcessing(false);
          setResponseMessage(error.message || "Unable to login");
        }
      }
    } else {
      alert("Please enter both username and password.");
    }
  };
  return (
    <div className=" h-[300px] w-[300px] mt-[calc(50vh-150px)] m-auto rounded-xl shadow-lg bg-indigo-300">
      <ul className="flex h-[40px] shadow-lg w-[300px] pt-[7px] bg-white bg-indigo-400 rounded-t-lg">
        <li
          className={`text-center w-[50%] cursor-pointer ${
            currAuthState === 0 && "font-bold"
          }`}
          onClick={() => handleAuthStateChange(0)}
        >
          Signup
        </li>
        <li
          className={`text-center w-[50%] cursor-pointer ${
            currAuthState === 1 && "font-bold"
          }`}
          onClick={() => handleAuthStateChange(1)}
        >
          Login
        </li>
      </ul>
      <div className="flex flex-col items-center justify-center pt-8 mx-auto rounded-lg p-6">
        <input
          type="text"
          placeholder="Username"
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={!(username.trim() && password.trim()) || processing}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition duration-300"
          onClick={handleSubmit}
        >
          {currAuthState === 0
            ? `Sign Up ${processing ? "processing..." : ""}`
            : `Sign In ${processing ? "processing..." : ""}`}
        </button>
        {responseMessage && (
          <p className="text-red-500 font-bold mt-[10px]">{responseMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Auth;
