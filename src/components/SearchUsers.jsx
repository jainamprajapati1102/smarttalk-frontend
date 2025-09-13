// import React, { useEffect, useState } from "react";
// import { search_user } from "../services/userService"; // Your API
// import { MdArrowBack } from "react-icons/md";
// import placeholderImg from "../assets/placeholder.png";
// import { accessChatService } from "../services/chatService";
// import { useNavigate } from "react-router-dom";
// import { useChat } from "../context/ChatContext";

// const SearchUsers = ({ onBack }) => {
//   const [search, setSearch] = useState("");
//   const [results, setResults] = useState([]);
//   const { setSelectedChat } = useChat();

//   const navigate = useNavigate();
//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!search.trim()) return;
//     try {
//       const token = localStorage.getItem("token");
//       const res = await search_user(search);
//       setResults(res.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     const delayDebounce = setTimeout(async () => {
//       if (!search.trim()) return [];

//       try {
//         const formdata = new FormData();
//         formdata.append("mobile", search);
//         const response = await search_user(formdata);
//         setResults(response.data);
//       } catch (error) {
//         console.error("Search error:", error);
//       }
//     }, 300);

//     return () => clearTimeout(delayDebounce);
//   }, [search]);
//   const accessChat = async (userId) => {
//     const formdata = new FormData();
//     formdata.append("userId", userId);
//     const res = await accessChatService(formdata);
//     if (res.status == 200) {
//       setSelectedChat(res.data);
//       navigate("chat", { state: { chat: res.data } });
//     }
//   };
//   return (
//     <div className="p-3 flex flex-col h-full">
//       {/* Back Button */}
//       <div className="flex flex-row items-center relative w-full mb-3">
//         {/* Back Button - fixed to the left */}
//         <button className="absolute left-0 p-2 text-green-600" onClick={onBack}>
//           <MdArrowBack size={24} />
//         </button>

//         {/* Centered Title */}
//         <span className="mx-auto text-lg font-semibold">New Chat</span>
//       </div>

//       {/* Search Bar */}
//       <form className="flex gap-2 mb-3 ">
//         <input
//           type="text"
//           placeholder="Search name or number"
//           className="w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-300 focus:border-green-500 text-xs sm:text-sm md:text-base focus:outline-none bg-[#f6f5f4]"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </form>

//       {/* Search Results */}
//       <div className="flex-1 overflow-auto">
//         {results.map((user) => (
//           // avatar = user?.profilePic;// || placeholderImg;

//           <li
//             key={user._id}
//             className="relative p-2 sm:p-3 hover:bg-gray-100 flex items-center gap-3"
//             onClick={() => accessChat(user._id)}
//           >
//             {/* Avatar */}
//             <img
//               src={user?.profilePic || placeholderImg}
//               alt="Profile"
//               className="w-8 h-8 rounded-full object-cover"
//             />
//             {/* Name */}
//             <span className="truncate">{user.name}</span>
//           </li>
//         ))}
//       </div>
//     </div>
//   );
// };
// export default SearchUsers;

import React, { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import placeholderImg from "../assets/placeholder.png";
import { search_user } from "../services/userService";
import { accessChatService } from "../services/chatService";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";
import GroupModal from "./GroupModal";

const SearchUsers = ({ onBack }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const { setSelectedChat } = useChat();
  const navigate = useNavigate();

  // 🔎 Debounced search for direct chat
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!search.trim()) {
        setResults([]);
        return;
      }
      try {
        const formdata = new FormData();
        formdata.append("mobile", search);
        const response = await search_user(formdata);
        setResults(response?.data || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const accessChat = async (userId) => {
    try {
      const formdata = new FormData();
      formdata.append("userId", userId);
      const res = await accessChatService(formdata);
      if (res.status === 200) {
        setSelectedChat(res.data);
        navigate("chat", { state: { chat: res.data } });
      }
    } catch (err) {
      console.error("Chat access error:", err);
    }
  };

  return (
    <div className="p-3 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-row items-center relative w-full mb-3">
        <button className="absolute left-0 p-2 text-green-600" onClick={onBack}>
          <MdArrowBack size={24} />
        </button>
        <span className="mx-auto text-lg font-semibold">New Chat</span>
      </div>

      {/* Search Bar */}
      <form className="flex gap-2 mb-3" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search name or number"
          className="w-full px-3 py-2 rounded-full border border-gray-300 focus:border-green-500 text-sm md:text-base focus:outline-none bg-[#f6f5f4]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      {/* Fixed Options */}
      <div className="mb-3">
        <div
          className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg"
          onClick={() => setShowGroupModal(true)}
        >
          <FaUsers className="text-green-600" size={20} />
          <span className="font-medium">New group</span>
        </div>
        <div className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg">
          <FaUserPlus className="text-green-600" size={20} />
          <span className="font-medium">New contact</span>
        </div>
        <div className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg">
          <MdGroups className="text-green-600" size={20} />
          <span className="font-medium">New community</span>
        </div>
      </div>

      <hr className="my-2" />

      {/* Search Results */}
      <div className="flex-1 overflow-auto">
        {results.map((user) => (
          <li
            key={user._id}
            className="relative p-2 sm:p-3 hover:bg-gray-100 flex items-center gap-3 cursor-pointer rounded-lg"
            onClick={() => accessChat(user._id)}
          >
            <img
              src={user?.profilePic || placeholderImg}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="truncate">{user.name}</span>
          </li>
        ))}
      </div>

      {/* Group Modal */}
      {showGroupModal && (
        <GroupModal onClose={() => setShowGroupModal(false)} />
      )}
    </div>
  );
};

export default SearchUsers;
