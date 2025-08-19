import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import { fetch_chat, search_user } from "../services/userService";
import placeholderImg from "../assets/placeholder.png";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";
import { MdExpandMore } from "react-icons/md";
import DropdownMenu from "./DropDownMenu";
import { get_sender } from "../config/ChatLogic";
import SearchUsers from "./SearchUsers";
import { formatChatTime, formatMessageDate } from "../utils/dateUtils";

const Sidebar = ({ activeTab, setActiveTab, setSearchOpen, searchOpen }) => {
  const tabs = ["All", "Unread", "Favorites", "Groups"];
  const [searchResult, setSearchResult] = useState([]);
  const [search, setSearch] = useState("");
  const [chatUsers, setChatUsers] = useState([]);
  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const { setSelectedChat } = useChat();
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedin"));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowMenuIndex(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Load chat users on mount
  useEffect(() => {
    const tokenn = localStorage.getItem("token");
    const fetchChats = async () => {
      try {
        await fetch_chat(tokenn).then((response) => {
          if (response.data) setChatUsers(response.data);
        });
      } catch (err) {
        console.error("Error loading chats:", err);
      }
    };
    fetchChats();
  }, []);

  const handleDropdownClick = (e, index) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({
      top: rect.top + window.scrollY + 20,
      left: rect.right + window.scrollX - 140,
    });
    setShowMenuIndex(index);
  };

  const handleChatClick = (data) => {
    setSelectedChat(data.chat);
    navigate("/chat", { state: { user: data.user, chat: data.chat } });
  };

  const userList = chatUsers;

  return (
    <div className="w-full sm:w-80 md:w-96 lg:w-[450px] bg-white border-r shadow-sm flex flex-col h-screen max-w-full overflow-hidden relative">
      {/* Search Screen */}
      <div
        className={`absolute inset-0 bg-white flex flex-col transition-transform duration-300 ease-in-out z-20 ${
          searchOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <SearchUsers onBack={() => setSearchOpen(false)} />
      </div>

      {/* Main Chat List */}
      <div
        className={`flex flex-col flex-1 transition-transform duration-300 ease-in-out ${
          searchOpen ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <Header setSearchOpen={setSearchOpen} />

        {/* Search Bar */}
        <div className="p-2 sm:p-3">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-300 focus:border-green-500 text-xs sm:text-sm md:text-base focus:outline-none bg-[#f6f5f4]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 sm:px-3 md:px-4 py-1 rounded-full border text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-green-200 text-black border-green-400"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-yellow-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto flex-1">
          {userList.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-xs sm:text-sm">
              No chats found
            </div>
          ) : (
            <ul>
              {userList.map((item, index) => {
                const isChat = Array.isArray(item.users);
                const isGroup = isChat && item.is_group;

                let displayName, avatar, chatData, userData;

                if (isChat) {
                  userData = isGroup
                    ? null
                    : get_sender(loggedUser, item.users);
                  displayName = isGroup ? item.chat_name : userData?.name;
                  avatar = isGroup
                    ? placeholderImg
                    : userData?.profilePic || placeholderImg;
                  chatData = item;
                } else {
                  displayName = item.name;
                  avatar = item.profilePic || placeholderImg;
                  chatData = null;
                  userData = item;
                }

                return (
                  <li
                    key={item._id || index}
                    className="relative p-2 sm:p-3 hover:bg-gray-100 flex items-center gap-3"
                    onClick={() =>
                      handleChatClick({
                        user: userData || displayName,
                        chat: chatData || {
                          is_new_chat: true,
                          user: userData,
                        },
                      })
                    }
                  >
                    {/* <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <img
                          src={avatar}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                      <span className="truncate">{displayName}</span>

                      {item.unseenCount > 0 && (
                        <span className="ml-auto mr-2 text-[10px] sm:text-xs md:text-sm bg-green-500 text-white px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full">
                          {item.unseenCount}
                        </span>
                      )}
                    </div> */}
                    <div className="flex items-center justify-between w-full px-3 py-2 ">
                      {/* Left section: Avatar + Name + Latest Msg */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={avatar}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex flex-col min-w-0">
                          {/* Chat Name */}
                          <span className="font-medium text-sm truncate">
                            {displayName}
                          </span>
                          {/* Latest Message */}
                          <span className="text-xs text-gray-500 truncate">
                            {item.latest_msg?.msg}
                          </span>
                        </div>
                      </div>

                      {/* Right section: Time + Unseen Count */}
                      <div className="flex flex-col items-end ml-2">
                        {/* Time */}
                        <span className="text-[10px] text-green-500">
                          {formatChatTime(item.latest_msg?.createdAt)}
                        </span>

                        {/* Unseen Count */}
                        {item.unseenCount > 0 && (
                          <span className="mt-1 text-[10px] sm:text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                            {item.unseenCount}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Dropdown Icon */}
                    <MdExpandMore
                      className="ml-auto text-base sm:text-lg md:text-xl cursor-pointer hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDropdownClick(e, index);
                      }}
                    />

                    {/* Dropdown Menu */}
                    {showMenuIndex === index && (
                      <DropdownMenu
                        top={menuPos.top}
                        left={menuPos.left}
                        isGroup={isGroup}
                        onClose={() => setShowMenuIndex(null)}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
