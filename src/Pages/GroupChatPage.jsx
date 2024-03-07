import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const [insideRoom, setInsideRoom] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [password, setPassword] = useState("");
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const roomName = new URLSearchParams(location.search).get("roomName");

  useEffect(() => {
    const joinRoom = () => {
      socket.emit("joinRoom", { roomId });
      socket.on("joinRoomSuccess", ({ room }) => {
        console.log("Joined room:", room);
        setInsideRoom(true);
        socket.on("message", (msg) => {
          console.log("message", msg, insideRoom);
          console.log("inside room");
          setChatMessages((prevMessages) => [...prevMessages, msg]);
        });
      });

      socket.on("joinRoomError", ({ message }) => {
        if (message === "Incorrect password") setIsPasswordRequired(true); // Set flag if the room is password-protected
      });
      socket.on("joinRoomError", ({ message }) => {
        console.error("Error joining room:", message);
      });
    };

    if (socket) {
      joinRoom();
    }

    return () => {
      if (socket) {
        socket.off("message");
      }
    };
  }, [roomId, socket]);

  const handleSendMessage = () => {
    if (socket && message && insideRoom) {
      socket.emit("sendGroupMessage", { message, room: roomId });
      setMessage("");
    }
  };

  const handleJoinRoom = () => {
    socket.emit("joinRoom", { roomId, password });
    socket.on("joinRoomSuccess", ({ room }) => {
      console.log("Joined room:", room);
      setInsideRoom(true);
      socket.on("message", (msg) => {
        console.log("message", msg, insideRoom);
        console.log("inside room");
        setChatMessages((prevMessages) => [...prevMessages, msg]);
      });
    });

    socket.on("joinRoomError", ({ message }) => {
      if (message === "Incorrect password") setIsPasswordRequired(true); // Set flag if the room is password-protected
    });
  };

  const handleCancelJoin = () => {
    navigate("/"); // Go back to the previous page if the user cancels joining the room
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-4">
        {insideRoom ? roomName : "Enter Password for " + roomName}
      </h1>
      {insideRoom && (
        <>
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
        </>
      )}
      {isPasswordRequired && !insideRoom && (
        <div className="mt-4 flex">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter room password..."
            className="mr-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleJoinRoom}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
          >
            Join Room
          </button>
          <button
            onClick={handleCancelJoin}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg focus:outline-none"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoomPage;
