import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    // Function to join the room
    const joinRoom = () => {
      // Send a request to the server to join the room
      socket.emit("joinRoom", { roomId });

      // Listen for success response from the server
      socket.on("joinRoomSuccess", ({ room }) => {
        console.log("Joined room:", room);
      });

      // Listen for error response from the server
      socket.on("joinRoomError", ({ message }) => {
        console.error("Error joining room:", message);
      });
    };

    if (socket) {
      // Join the room when the component mounts
      joinRoom();

      // Listen for incoming messages
      socket.on("message", (msg) => {
        setChatMessages((prevMessages) => [...prevMessages, msg]);
      });
    }

    // Cleanup function
    return () => {
      if (socket) {
        socket.off("message");
      }
    };
  }, [roomId, socket]);

  const handleSendMessage = () => {
    if (socket && message) {
      socket.emit("sendGroupMessage", { message, room: roomId });
      setMessage("");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-4">Chat Room {roomId}</h1>
      <div>
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.sender === socket.id ? "bg-blue-100" : "bg-gray-100"
            } px-3 py-2 mb-2 rounded-lg`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
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

export default ChatRoomPage;
