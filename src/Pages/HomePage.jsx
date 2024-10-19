import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const LoginPage = () => {
  const [tag, setTag] = useState("");
  const [gender, setGender] = useState("");
  const [matchWithGender, setmatchWithGender] = useState("");
  const { socket, setSocket } = useSocket();
  const navigate = useNavigate();

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const handleGenderChange = (gender) => {
    setGender(gender);
  };
  const handlematchWithGenderChange = (gender) => {
    setmatchWithGender(gender);
  };

  const handleStartChat = () => {
    console.log(socket);
    if (socket) {
      console.log("socket already there");
      socket.connect();
      socket.emit("setTag", { tag: tag || "notag", gender, matchWithGender });
      console.log("Tag:", tag);
      navigate(
        `/chat?tag=${tag}&gender=${gender}&matchWithGender=${matchWithGender}`
      );
    }
  };

  return (
    <div className=" w-full h-1/3 mt-auto p-4 bg-teal-900 text-white  shadow-lg flex flex-col justify-around">
      <input
        type="text"
        id="tag"
        placeholder="Tag to search"
        value={tag}
        onChange={handleTagChange}
        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
      />

      <div className="">
        Your Gender
        <div className="flex justify-around">
          <button
            onClick={() => handleGenderChange("male")}
            className={
              gender == "male"
                ? "w-1/4 p-3 rounded-md bg-blue-500 text-white"
                : "w-1/4 p-3 rounded-md border-2"
            }
          >
            Male
          </button>
          <button
            onClick={() => handleGenderChange("female")}
            className={
              gender == "female"
                ? "w-1/4 p-3 rounded-md bg-pink-500 text-white"
                : " w-1/4 p-3 rounded-md border-2"
            }
          >
            Female
          </button>
          <button
            onClick={() => handleGenderChange("other")}
            className={
              gender == "other"
                ? "w-1/4 p-3 rounded-md bg-orange-500 text-white"
                : " w-1/4 p-3 rounded-md border-2"
            }
          >
            Others
          </button>
        </div>
      </div>

      <div className="">
        Match With
        <div className="flex justify-around">
          <button
            onClick={() => handlematchWithGenderChange("male")}
            className={
              matchWithGender == "male"
                ? "w-1/4 p-3 rounded-md bg-blue-500 text-white"
                : "w-1/4 p-3 rounded-md border-2"
            }
          >
            Male
          </button>
          <button
            onClick={() => handlematchWithGenderChange("female")}
            className={
              matchWithGender == "female"
                ? "w-1/4 p-3 rounded-md bg-pink-500 text-white"
                : " w-1/4 p-3 rounded-md border-2"
            }
          >
            Female
          </button>
          <button
            onClick={() => handlematchWithGenderChange("other")}
            className={
              matchWithGender == "other"
                ? "w-1/4 p-3 rounded-md bg-orange-500 text-white"
                : " w-1/4 p-3 rounded-md border-2"
            }
          >
            Others
          </button>
        </div>
      </div>

      <button
        onClick={handleStartChat}
        className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg focus:outline-none"
      >
        Start Chat
      </button>
    </div>
  );
};

export default LoginPage;
