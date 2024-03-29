import React, { useEffect, useState } from "react";
import { SocketProvider } from "./context/SocketContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatRoom from "./Pages/ChatRoom";
import LoginPage from "./Pages/HomePage";

import io from "socket.io-client";
import CreateChatRoom from "./Pages/CreateRoom";
import ChatGroup from "./Pages/ChatGroup";
import ChatRoomPage from "./Pages/GroupChatPage";
function App() {
  const [activeUsersCount, setActiveUsersCount] = useState();
  const [genderCount, setGenderCount] = useState();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // Create socket connection
    setSocket(newSocket);

    newSocket.on("activeUsersCount", (data) => {
      setActiveUsersCount(data);
      console.log(`activeUsersCount ${data}`);
    });
    newSocket.on("genderCount", (data) => {
      setGenderCount(data);
      console.log(` gender count ${data}`);
    });

    // Disconnect socket when component unmounts
    // return () => {
    //   newSocket.disconnect();
    // };
  }, []); // Empty dependency array ensures the effect runs only once

  console.log("app rendering");

  return (
    <Router>
      <div className="App bg-slate-400 h-screen p-1 flex flex-col">
        <h1 className="text-4xl font-bold text-center my-5">
          Omelge
          <span className="text-sky-700 text-lg mx-10">
            <span className="font-semibold">Online:</span> {activeUsersCount}
            &nbsp;|&nbsp;
            <span className="font-semibold text-blue-600">Male:</span>
            {genderCount?.maleUsers} &nbsp;|&nbsp;
            <span className="font-semibold text-pink-600">Female:</span>
            {genderCount?.femaleUsers}
          </span>
        </h1>
        <SocketProvider socket={socket} setSocket={setSocket}>
          <Routes>
            <Route path="/chat" element={<ChatRoom />} />
            {/* <Route path="/" element={<LoginPage />} /> */}
            <Route path="/create-room" element={<CreateChatRoom />} />
            <Route path="/" element={<ChatGroup />} />
            <Route path="/chat-room/:roomId" element={<ChatRoomPage />} />
          </Routes>
        </SocketProvider>
      </div>
    </Router>
  );
}

export default App;
