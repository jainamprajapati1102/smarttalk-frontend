// components/Sidebar.jsx
import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import { exist_msg, search_user } from "../services/userService";
import placeholderImg from "../assets/placeholder.png";
import { useChat } from "../context/SelectedUserContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  MdExpandMore,
} from "react-icons/md";
import DropdownMenu from "./DropdownMenu";

const Sidebar = ({ activeTab, setActiveTab, search, setSearch }) => {
  const tabs = ["All", "Unread", "Favorites", "Groups"];
  const [searchResult, setSearchResult] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const chatItemRefs = useRef([]);
  const { setSelectedUser } = useChat();
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setShowMenuIndex(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Debounced user search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!search.trim()) return setSearchResult([]);

      try {
        const formdata = new FormData();
        formdata.append("mobile", search);
        const response = await search_user(formdata);
        setSearchResult(response.data.find_user);
      } catch (error) {
        console.error("Search error:", error.message);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Load chat users
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const id = Cookies.get("token");
        const formdata = new FormData();
        formdata.append("id", id);
        const response = await exist_msg(formdata);

        if (response.data.exist) {
          setChatUsers(response.data.exist);
        }
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
      left: rect.left + window.scrollX - 200,
    });
    setShowMenuIndex(index);
  };

  const handleChatClick = (user) => {
    setSelectedUser(user);
    navigate("/chat");
  };

  const userList = searchResult.length > 0 ? searchResult : chatUsers;

  return (
    <div className="w-[450px] bg-white border-r shadow-sm flex flex-col">
      <Header />

      {/* Search */}
      <div className="p-2">
        <input
          type="text"
          placeholder="Search or start new chat"
          className="w-full px-3 py-1 rounded-full border text-sm focus:outline-none bg-[#f6f5f4]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-2 py-2 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded-full border text-sm font-medium transition-all ${
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
      <ul className="overflow-y-auto flex-1">
        {userList.map((item, index) => (
          <li
            key={index}
            ref={(el) => (chatItemRefs.current[index] = el)}
            className="relative p-4 hover:bg-gray-100 flex items-center gap-4 group"
          >
            {/* Profile Pic */}
            <img
              src={item.profilePic || placeholderImg}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />

            {/* Main clickable area */}
            <div
              className="flex items-center w-full justify-between cursor-pointer"
              onClick={() => handleChatClick(item)}
            >
              <span>{item?.name || item?.senderName}</span>
              {item.unseenCount > 0 && (
                <span className="ml-auto text-sm bg-green-500 text-white px-2 py-0.5 rounded-full">
                  {item.unseenCount}
                </span>
              )}
            </div>

            {/* Dropdown Icon */}
            <MdExpandMore 
              className="text-xl ml-2 cursor-pointer hover:text-gray-600"
              onClick={(e) => handleDropdownClick(e, index)}
            />

            {/* Dropdown menu */}
            {showMenuIndex === index && (
              <DropdownMenu
                top={menuPos.top}
                left={menuPos.left}
                onClose={() => setShowMenuIndex(null)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
