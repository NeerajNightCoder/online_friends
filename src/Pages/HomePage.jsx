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

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };
  const handlematchWithGenderChange = (e) => {
    setmatchWithGender(e.target.value);
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
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <input
          type="text"
          id="tag"
          placeholder="Tag to search"
          value={tag}
          onChange={handleTagChange}
          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <select
          id="gender"
          value={gender}
          onChange={handleGenderChange}
          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <select
          id="matchWithGender"
          value={matchWithGender}
          onChange={handlematchWithGenderChange}
          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        >
          <option value="">Find Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleStartChat}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
