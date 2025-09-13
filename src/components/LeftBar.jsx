import React from "react";
import { FaComments, FaUserFriends, FaUserCircle, FaCog } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import placeholderImg from "../assets/placeholder.png";
import { useUserChat } from "../context/UserChatContext";
// Tooltip Wrapper Component
const TooltipIcon = ({ children, label, onClick }) => (
  <div
    className="relative group cursor-pointer"
    onClick={onClick} // ✅ Add this
  >
    <div className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition-all duration-200 ease-in-out">
      {children}
    </div>
    <span className="absolute left-12 sm:left-14 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-all bg-black text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap z-10">
      {label}
    </span>
  </div>
);

const LeftBar = ({ setShowProfile }) => {
  const { userChat } = useUserChat();
  const totalUnseen = userChat?.reduce(
    (sum, chat) => sum + (chat.unseenCount || 0),
    0
  );
  return (
    <div className="w-12 sm:w-16 bg-white border-r flex flex-col items-center py-2 sm:py-4 justify-between">
      {/* Top Icons */}
      <div className="flex flex-col gap-4 sm:gap-6 items-center">
        {/* Chat Icon with Notification */}
        <TooltipIcon label="Chats">
          <div className="relative">
            <FaComments className="text-lg sm:text-xl text-gray-700" />
            {totalUnseen > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-green-500 text-white 
                       text-[8px] sm:text-xs rounded-full px-0.5 sm:px-1"
              >
                {totalUnseen}
              </span>
            )}
          </div>
        </TooltipIcon>

        <TooltipIcon label="Status">
          <FaUserCircle className="text-xl sm:text-2xl text-gray-600" />
        </TooltipIcon>

        <TooltipIcon label="Contacts">
          <FaUserFriends className="text-xl sm:text-2xl text-gray-600" />
        </TooltipIcon>

        <TooltipIcon label="Groups">
          <MdGroups className="text-xl sm:text-2xl text-gray-600" />
        </TooltipIcon>

        <hr className="w-6 sm:w-8 border-gray-300 my-1 sm:my-2" />

        <TooltipIcon label="AI Assistant">
          <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-pulse" />
        </TooltipIcon>
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <TooltipIcon label="Settings">
          <FaCog className="text-xl sm:text-2xl text-gray-600" />
        </TooltipIcon>
        <TooltipIcon label="Profile" onClick={() => setShowProfile(true)}>
          <img
            src={placeholderImg}
            alt="User"
            className="w-6 sm:w-8 h-6 sm:h-8 rounded-full object-cover"
          />
        </TooltipIcon>
      </div>
    </div>
  );
};

export default LeftBar;
