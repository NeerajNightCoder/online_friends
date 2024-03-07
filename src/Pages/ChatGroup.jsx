import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../context/SocketContext"; // Import SocketContext

function ChatGroup() {
  const { socket } = useSocket(); // Access socket from SocketContext
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Emit a request to fetch available chat rooms from the backend
    getChatGroups(socket);
  }, [socket]);

  const getChatGroups = (socket) => {
    console.log("getChatGroups");
    if (socket) {
      socket.emit("getChatRooms");
      socket.on("chatRoomsList", (chatGroups) => {
        console.log(chatGroups);
        setRooms(chatGroups);
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Available Chat Rooms</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room.id} className="mb-2">
            <Link
              to={`/chat-room/${room.id}`}
              className="text-blue-600 hover:underline"
            >
              {room.name}
            </Link>
            {room.isLocked && (
              <span className="ml-2 text-red-500"> (Password Required)</span>
            )}
          </li>
        ))}
      </ul>
      <Link
        to="/create-room"
        className="block mt-4 text-blue-600 hover:underline"
      >
        Create New Chat Room
      </Link>
    </div>
  );
}

export default ChatGroup;
