import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

const ChatRoom = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [activeUsersCount, setActiveUsersCount] = useState();

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const tag = searchParams.get("tag");

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");

    newSocket.on("connect", () => {
      console.log("Connected to server", newSocket);
      setSocket(newSocket);
      newSocket.emit("setTag", tag);
    });
    newSocket.on("activeUsersCount", (data) => {
      activeUsersCount(data);
      console.log(`activeUsersCount ${data}`);
    });
    newSocket.on("matched", (data) => {
      setRoom(data.room);
      console.log(`Matched with room ${data}`);
    });

    newSocket.on("message", (msg) => {
      console.log(socketRef.current, msg, msg.sender === socketRef.current.id);

      setChatMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSetTag = () => {
    if (socket && tag) {
      console.log(`Tag ${tag} set`);
    }
  };

  const handleSendMessage = () => {
    if (socket && message) {
      socket.emit("sendMessage", { roomName: room, message });
      setMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Chat Room</h1>

      {room && <p className="mt-4">You are matched in room: {room}</p>}
      <div className="mb-4">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.sender === socketRef.current.id
                ? "bg-cyan-50 "
                : "bg-gray-50 "
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
