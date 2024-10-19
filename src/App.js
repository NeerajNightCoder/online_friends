import React, { useEffect, useState } from "react";
import { SocketProvider } from "./context/SocketContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatRoom from "./Pages/ChatRoom";
import LoginPage from "./Pages/HomePage";

import io from "socket.io-client";
import CreateChatRoom from "./Pages/CreateRoom";
import ChatGroup from "./Pages/ChatGroup";
import ChatRoomPage from "./Pages/GroupChatPage";

import  Male from './assets/male-user.ico'
import  Female from './assets/woman-avatar.png'

function App() {
  const [activeUsersCount, setActiveUsersCount] = useState();
  const [genderCount, setGenderCount] = useState();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("https://online-friends-server.onrender.com"); // Create socket connection
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
      <div className="App bg-slate-800 py-2  h-screen  flex flex-col">
        <h1 className="text-4xl text-orange-600 font-bold text-left pl-5 ">
          Friends Online
        </h1>
        <div className="flex justify-center items-center text-3xl absolute right-5 top-0">
            <span className=" text-blue-500"><i class="fad fa-male  text-blue-500"></i>
            <span className=" mx-3 mr-5">{genderCount?.maleUsers|0}</span></span>
            <span className=" text-pink-500"><i class="fad fa-female "></i>
            <span className="ml-3 ">{genderCount?.femaleUsers|0}</span></span>
          </div>
        <SocketProvider socket={socket} setSocket={setSocket}>
          <Routes>
            <Route path="/chat" element={<ChatRoom />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/create-room" element={<CreateChatRoom />} />
            <Route path="/chat-group" element={<ChatGroup />} />
            <Route path="/chat-room/:roomId" element={<ChatRoomPage />} />
          </Routes>
        </SocketProvider>
      </div>
    </Router>
  );
}

export default App;
