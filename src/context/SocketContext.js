import React, { createContext, useContext } from "react";

// Create a context for the socket
const SocketContext = createContext();

// Custom hook to access the socket context
export const useSocket = () => useContext(SocketContext);

// SocketProvider component
export const SocketProvider = ({ socket, children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
