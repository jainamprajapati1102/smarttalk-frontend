// socketService.js
import { io } from "socket.io-client";

let socket;

export const initSocket = (token) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URI, {
      withCredentials: true,
      auth: { token },
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initSocket first.");
  }
  return socket;
};
