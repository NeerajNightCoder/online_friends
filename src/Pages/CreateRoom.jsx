import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext"; // Import SocketContext

function CreateChatRoom() {
  const { socket } = useSocket();
  const [roomName, setRoomName] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send data to backend to create a new chat room
    // Emit an event to create room
    socket.emit(
      "createRoom",
      { name: roomName, isLocked, password },
      (response) => {
        if (response.success) {
          // Redirect user to the list of chat rooms
          navigate("/"); // Redirect to the list of chat rooms
        } else {
          console.error("Failed to create chat room:", response.error);
        }
      }
    );
    console.log(socket);
  };

  // Listen for createRoomSuccess event
  socket.on("createRoomSuccess", (data) => {
    console.log("Room created successfully:", data.room);
    // Redirect user to the list of chat rooms
    navigate("/");
  });

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Create New Chat Room</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="roomName"
            className="block text-sm font-medium text-gray-700"
          >
            Room Name:
          </label>
          <input
            id="roomName"
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lockRoom" className="flex items-center">
            <input
              id="lockRoom"
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Lock Room</span>
          </label>
        </div>
        {isLocked && (
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        >
          Create Room
        </button>
      </form>
    </div>
  );
}

export default CreateChatRoom;
