import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const { socket } = useSocket();
  const location = useLocation();
  const tag = new URLSearchParams(location.search).get("tag");
  const gender = new URLSearchParams(location.search).get("gender");
  const [matched, setMatched] = useState(false);
  const [userDisconnected, setUserDisconnected] = useState(false);
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.on("message", (msg) => {
        console.log(msg);
        setChatMessages((prevMessages) => [...prevMessages, msg]);
      });

      socket.on("userLeft", () => {
        setMatched(false);
        setUserDisconnected(true);
      });
      socket.on("matched", (data) => {
        setMatched(true);
        setRoom(data.room);
        setUserDisconnected(false);
        console.log(`Matched with room ${data}`);
      });
    }
    return () => {
      if (socket) {
        socket.off("message");
      }
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (socket && message && !userDisconnected) {
      socket.emit("sendMessage", { message, room });
      setMessage("");
    }
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
      navigate("/");
    }
  };

  const getMatchText = () => {
    if (userDisconnected) return "";
    if (!matched) return "Waiting for someone to connect";
    if (!tag) return "No tags applied, chatting with random user";
    return `Chatting with random user about ${tag}`;
  };

  const handleFindNewUser = () => {
    if (socket) {
      setUserDisconnected(false);
      socket.emit("setTag", { tag: tag || "notag", gender });
    }
  };

  return (
    <div className=" mt-auto shadow-lg">
      <div className="mb-4 p-3">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.sender === socket.id
                ? "bg-cyan-50 ml-auto "
                : "bg-orange-400 mr-auto"
            } px-3 py-2 mb-2 rounded-lg w-11/12`}
          >
            {msg.message}
          </div>
        ))}
      </div>{" "}
      <div className="flex justify-between ">
        <p className="text-white pl-1">{getMatchText()}</p>
      </div>
      {userDisconnected && (
        <h1 className="text-red-500 text-xl pl-1">** User Disconnected **</h1>
      )}
      <div className="flex justify-between">
        {userDisconnected ? (
          <button
            onClick={handleFindNewUser}
            className="bg-orange-500 p-3  rounded-lg mx-1 text-white"
          >
            New <i class="fal fa-redo"></i>
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="px-2 bg-red-500 text-white rounded-lg focus:outline-none mx-1"
          >
            Skip
          </button>
        )}
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSendMessage();
          }}
          className="flex-1  px-3 py-2 border mr-1 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        {/* <button
          onClick={handleSendMessage}
          className="px-2 bg-blue-500 text-white rounded-lg focus:outline-none mx-1"
        >
          Send
        </button> */}
      </div>
    </div>
  );
};

export default ChatRoom;
