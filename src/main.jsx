import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { SocketProvider } from "./context/SocketContex";
import { UserChatProvider } from "./context/UserChatContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <UserChatProvider>
        <ChatProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </ChatProvider>
      </UserChatProvider>
    </AuthProvider>
  </React.StrictMode>
);
