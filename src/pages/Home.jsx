import React from "react";
import { useSocket } from "../context/SocketContex";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { onlineUsers } = useSocket();
  const { user } = useAuth();
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Show socket status */}
      <div className="p-2 text-center text-sm text-gray-600">
        {/* {onlineUsers.includes(user._id) ? (
          <span className="text-green-600">Connected</span>
        ) : (
          <span className="text-red-600">🔴 Disconnected</span>
        )} */}
      </div>

      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {/* Centered SVG Content */}
        <svg
          className="max-w-full max-h-full"
          viewBox="0 0 800 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="800" height="400" fill="#f8f6f5" />
          <ellipse cx="400" cy="200" rx="320" ry="160" fill="#dff7f5" />

          {/* Phone */}
          <g transform="translate(200, 120)">
            <rect
              x="0"
              y="0"
              rx="15"
              ry="15"
              width="80"
              height="160"
              fill="#fff"
              stroke="#3a6175"
              strokeWidth="2"
            />
            <circle cx="40" cy="15" r="3" fill="#3a6175" />
            <g transform="translate(20, 120)" stroke="#3a6175" strokeWidth="3">
              <line x1="0" y1="20" x2="0" y2="30" />
              <line x1="10" y1="15" x2="10" y2="30" />
              <line x1="20" y1="10" x2="20" y2="30" />
              <line x1="30" y1="5" x2="30" y2="30" />
            </g>
            <line
              x1="25"
              y1="100"
              x2="55"
              y2="130"
              stroke="#ff6666"
              strokeWidth="3"
            />
            <line
              x1="25"
              y1="130"
              x2="55"
              y2="100"
              stroke="#ff6666"
              strokeWidth="3"
            />
          </g>

          {/* Laptop */}
          <g transform="translate(450, 100)">
            <rect
              x="0"
              y="0"
              width="180"
              height="120"
              rx="10"
              fill="#eafefb"
              stroke="#3a6175"
              strokeWidth="2"
            />
            <circle cx="90" cy="60" r="20" fill="#61d9a1" />
            <path
              d="M80 60 l5 5 l10 -10"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <rect x="0" y="120" width="180" height="10" rx="2" fill="#3a6175" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Home;
