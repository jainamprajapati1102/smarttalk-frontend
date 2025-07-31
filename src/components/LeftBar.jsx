import React from "react";
import { FaComments, FaUserFriends, FaUserCircle, FaCog } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import placeholderImg from "../assets/placeholder.png";

// Tooltip Wrapper Component
const TooltipIcon = ({ children, label }) => (
  <div className="relative group cursor-pointer">
    <div className="hover:bg-gray-100 p-2 rounded-full transition-all duration-200 ease-in-out">
      {children}
    </div>
    <span className="absolute left-14 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-all bg-black text-white text-xs px-2 py-1 rounded-full whitespace-nowrap z-10">
      {label}
    </span>
  </div>
);

const LeftBar = () => {
  return (
    <div className="w-16 bg-white border-r flex flex-col items-center py-4 justify-between">
      {/* Top Icons */}
      <div className="flex flex-col gap-6 items-center">
        {/* Chat Icon with Notification */}
        <TooltipIcon label="Chats">
          <div className="relative">
            <FaComments className="text-xl text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1">
              1
            </span>
          </div>
        </TooltipIcon>

        <TooltipIcon label="Status">
          <FaUserCircle className="text-2xl text-gray-600" />
        </TooltipIcon>

        <TooltipIcon label="Contacts">
          <FaUserFriends className="text-2xl text-gray-600" />
        </TooltipIcon>

        <TooltipIcon label="Groups">
          <MdGroups className="text-2xl text-gray-600" />
        </TooltipIcon>

        <hr className="w-8 border-gray-300 my-2" />

        <TooltipIcon label="AI Assistant">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-pulse" />
        </TooltipIcon>
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center gap-4">
        <TooltipIcon label="Settings">
          <FaCog className="text-2xl text-gray-600" />
        </TooltipIcon>
        <TooltipIcon label="Profile">
          <img
            src={placeholderImg}
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
        </TooltipIcon>
      </div>
    </div>
  );
};

export default LeftBar;
