// src/context/SocketContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import cookie from "js-cookie";
import { ChatEventEnum } from "../constant.js";
const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("loggedin");

    if (!token || !userId) return;

    // Create socket connection once
    const socketInstance = io(import.meta.env.VITE_SOCKET_URI, {
      withCredentials: true,
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    setSocket(socketInstance);

    // socketInstance.on("connection", () => {
    //   console.log("Socket connected:", socketInstance.id);
    //   socketInstance.emit("setup", userId._id);
    // });

    socketInstance.on(ChatEventEnum.CONNECTED_EVENT, () => {
      console.log("Server says: connected");
      setSocketConnected(true);
    });

    socketInstance.on(ChatEventEnum.DISCONNECT_EVENT, () => {
      console.log("Socket disconnected");
      setSocketConnected(false);
    });

    
    // Cleanup
    return () => {
      socketInstance.disconnect();
    };
  }, []); // Run only once when provider mounts

  return (
    <SocketContext.Provider value={{ socket, socketConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// ✅ Custom hook
export const useSocket = () => useContext(SocketContext);
