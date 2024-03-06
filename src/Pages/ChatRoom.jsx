import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const socket = useSocket();
  const location = useLocation();
  const tag = new URLSearchParams(location.search).get("tag");
  const [matched, setMatched] = useState(false);
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.on("message", (msg) => {
        console.log(msg);
        setChatMessages((prevMessages) => [...prevMessages, msg]);
      });

      socket.on("userLeft", (data) => {
        setMatched(false);
        console.log(`User ${data} left`);
        navigate("/");
      });
      socket.on("matched", (data) => {
        setMatched(true);
        setRoom(data.room);
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
    if (socket && message) {
      socket.emit("sendMessage", { message, room });
      setMessage("");
    }
  };

  const getMatchText = () => {
    if (!matched) return "Waiting for someone to connect";
    if (!tag) return "No tags applied, chatting with random user";
    else return "Chatting with random user about " + tag;
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
      <p>{getMatchText()}</p>
      <div className="mb-4">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.sender === socket.id ? "bg-cyan-50 " : "bg-gray-50 "
            }px-3 py-2 mb-2 rounded-lg`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 mr-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
