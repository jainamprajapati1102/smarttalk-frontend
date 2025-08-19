import React, { useEffect, useState } from "react";
import { search_user } from "../services/userService"; // Your API
import { MdArrowBack } from "react-icons/md";
import placeholderImg from "../assets/placeholder.png";
import { accessChatService } from "../services/chatService";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";

const SearchUsers = ({ onBack }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { setSelectedChat } = useChat();

  const navigate = useNavigate();
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await search_user(search,token);
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!search.trim()) return [];

      try {
        const formdata = new FormData();
        formdata.append("mobile", search);
        const response = await search_user(formdata);
        setResults(response.data);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);
  const accessChat = async (userId) => {
    const formdata = new FormData();
    formdata.append("userId", userId);
    const res = await accessChatService(formdata);
    if (res.status == 200) {
      setSelectedChat(res.data);
      navigate("chat", { state: { chat: res.data } });
    }
  };
  return (
    <div className="p-3 flex flex-col h-full">
      {/* Back Button */}
      <div className="flex flex-row items-center relative w-full mb-3">
        {/* Back Button - fixed to the left */}
        <button className="absolute left-0 p-2 text-green-600" onClick={onBack}>
          <MdArrowBack size={24} />
        </button>

        {/* Centered Title */}
        <span className="mx-auto text-lg font-semibold">New Chat</span>
      </div>

      {/* Search Bar */}
      <form className="flex gap-2 mb-3 ">
        <input
          type="text"
          placeholder="Search name or number"
          className="w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-300 focus:border-green-500 text-xs sm:text-sm md:text-base focus:outline-none bg-[#f6f5f4]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      {/* Search Results */}
      <div className="flex-1 overflow-auto">
        {results.map((user) => (
          // avatar = user?.profilePic;// || placeholderImg;

          <li
            key={user._id}
            className="relative p-2 sm:p-3 hover:bg-gray-100 flex items-center gap-3"
            onClick={() => accessChat(user._id)}
          >
            {/* Avatar */}
            <img
              src={user?.profilePic || placeholderImg}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            {/* Name */}
            <span className="truncate">{user.name}</span>
          </li>
        ))}
      </div>
    </div>
  );
};

export default SearchUsers;
