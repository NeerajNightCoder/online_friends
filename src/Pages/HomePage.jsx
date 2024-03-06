import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const LoginPage = () => {
  const [tag, setTag] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const handleStartChat = () => {
    console.log(socket);
    if (socket) {
      socket.emit("setTag", tag || "notag");
      console.log("Tag:", tag);
      navigate(`/chat?tag=${tag}`);
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
