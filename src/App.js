import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatRoom from "./Pages/ChatRoom";
import LoginPage from "./Pages/HomePage";

function App() {
  return (
    <Router>
      <div className="App bg-slate-400">
        <Routes>
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
