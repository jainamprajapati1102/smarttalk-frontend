// // SocketContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import { useAuth } from "./AuthContext"; // use your AuthContext
// import { ChatEventEnum } from "../constant.js";

// const SocketContext = createContext(null);

// export const SocketProvider = ({ children }) => {
//   const { user } = useAuth();
//   const [socket, setSocket] = useState(null);
//   const [socketConnected, setSocketConnected] = useState(false);

//   useEffect(() => {
//     if (!user) return;

//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const socketInstance = io(import.meta.env.VITE_SOCKET_URI, {
//       withCredentials: true,
//       extraHeaders: { Authorization: `Bearer ${token}` },
//     });

//     setSocket(socketInstance);

//     socketInstance.on(ChatEventEnum.CONNECTED_EVENT, () => {
//       console.log("Server says: connected");
//       setSocketConnected(true);
//     });

//     socketInstance.on(ChatEventEnum.DISCONNECT_EVENT, () => {
//       console.log("Socket disconnected");
//       setSocketConnected(false);
//     });

//     return () => socketInstance.disconnect();
//   }, [user]); // reconnect when user changes

//   return (
//     <SocketContext.Provider value={{ socket, socketConnected }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);

// SocketContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { ChatEventEnum } from "../constant.js";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({}); // { userId: true/false }

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const socketInstance = io(import.meta.env.VITE_SOCKET_URI, {
      path: "/socket.io", // keep if server uses default path
      transports: ["websocket", "polling"],
      auth: { token }, // <-- send token here (browser-safe)
      withCredentials: true,
      reconnectionAttempts: 5,
    });

    setSocket(socketInstance);

    socketInstance.on(ChatEventEnum.CONNECTED_EVENT, () => {
      console.log("✅ Connected to server client-side");
      setSocketConnected(true);
    });

    socketInstance.on(ChatEventEnum.DISCONNECT_EVENT, () => {
      console.log("❌ Socket disconnected");
      setSocketConnected(false);
    });

    // --- Online Users ---
    socketInstance.on("online-users", (users) => {
      setOnlineUsers(new Set(users));
    });

    socketInstance.on("user-online", (userId) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    socketInstance.on("user-offline", (userId) => {
      setOnlineUsers((prev) => {
        const copy = new Set(prev);
        copy.delete(userId);
        return copy;
      });
    });

    // --- Typing Events ---
    socketInstance.on("user-typing", (userId) => {
      setTypingUsers((prev) => ({ ...prev, [userId]: true }));
    });

    socketInstance.on("user-stop-typing", (userId) => {
      setTypingUsers((prev) => ({ ...prev, [userId]: false }));
    });

    return () => socketInstance.disconnect();
  }, [user]);

  return (
    <SocketContext.Provider
      value={{ socket, socketConnected, onlineUsers, typingUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
