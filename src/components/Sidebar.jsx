// // Sidebar.jsx
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import Header from "./Header";
// import { fetch_chat } from "../services/chatService";
// import placeholderImg from "../assets/placeholder.png";
// import { useChat } from "../context/ChatContext";
// import { useNavigate } from "react-router-dom";
// import { MdExpandMore } from "react-icons/md";
// import DropdownMenu from "./DropDownMenu";
// import { get_sender } from "../config/ChatLogic";
// import SearchUsers from "./SearchUsers";
// import { formatChatTime } from "../utils/dateUtils";
// import { FaHeart } from "react-icons/fa";
// import { useUserChat } from "../context/UserChatContext";
// import { useSocket } from "../context/SocketContex";
// import { msg_seen_service } from "../services/messageService";
// import { useAuth } from "../context/AuthContext"; // ✅ import auth

// const Sidebar = ({ activeTab, setActiveTab, setSearchOpen, searchOpen }) => {
//   const tabs = ["All", "Unread", "Favorites", "Groups"];
//   const [search, setSearch] = useState("");
//   const [chatUsers, setChatUsers] = useState([]);
//   const [showMenuIndex, setShowMenuIndex] = useState(null);
//   const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
//   const { selectedChat, setSelectedChat } = useChat();
//   const navigate = useNavigate();
//   const { setUserChat } = useUserChat();
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const limit = 10;
//   const { socket } = useSocket();

//   // ✅ get logged user + token from context
//   const { user: loggedUser, token } = useAuth();

//   // listen for new messages
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("newMessage", (msg) => {
//       if (msg.sender._id === loggedUser?._id) return;

//       setChatUsers((prevChats) =>
//         prevChats.map((chat) => {
//           if (chat._id === msg.chat._id) {
//             if (chat._id !== selectedChat?._id) {
//               return {
//                 ...chat,
//                 latest_msg: msg,
//                 unseenCount: (chat.unseenCount || 0) + 1,
//               };
//             } else {
//               return { ...chat, latest_msg: msg };
//             }
//           }
//           return chat;
//         })
//       );
//     });

//     return () => {
//       socket.off("newMessage");
//     };
//   }, [socket, loggedUser, selectedChat]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = () => setShowMenuIndex(null);
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const handleDropdownClick = (e, index) => {
//     e.stopPropagation();
//     const rect = e.currentTarget.getBoundingClientRect();
//     setMenuPos({
//       top: rect.top + window.scrollY + 20,
//       left: rect.right + window.scrollX - 140,
//     });
//     setShowMenuIndex(index);
//   };

//   const handleChatClick = async (data) => {
//     setSelectedChat(data.chat);

//     setChatUsers((prevChats) =>
//       prevChats.map((chat) =>
//         chat._id === data.chat._id ? { ...chat, unseenCount: 0 } : chat
//       )
//     );

//     if (token) {
//       const formdata = new FormData();
//       formdata.append("chat_id", data.chat._id);
//       const response = await msg_seen_service(formdata, token); // ✅ pass token
//       if (response.status === 200) {
//         navigate("/chat", { state: { user: data.user, chat: data.chat } });
//       }
//     }
//   };

//   // filter chats by tabs
//   const filteredChats = useMemo(() => {
//     switch (activeTab) {
//       case "Unread":
//         return chatUsers.filter((chat) => chat.unseenCount > 0);
//       case "Favorites":
//         return chatUsers.filter((chat) => chat.is_favorite);
//       case "Groups":
//         return chatUsers.filter((chat) => chat.is_group);
//       default:
//         return chatUsers;
//     }
//   }, [activeTab, chatUsers]);

//   // ✅ load chats with token
//   const loadChats = useCallback(
//     async (newPage) => {
//       if (!hasMore || !token) return;

//       try {
//         const response = await fetch_chat(newPage, limit, token);

//         if (response.data && response.data.length > 0) {
//           setHasMore(response.data.length === limit);

//           if (newPage === 1) {
//             setChatUsers(response.data);
//             setUserChat(response.data);
//           } else {
//             setChatUsers((prev) => [...prev, ...response.data]);
//             setUserChat((prev) => [...(prev || []), ...response.data]);
//           }
//         } else {
//           setHasMore(false);
//         }
//       } catch (err) {
//         setHasMore(false);
//         console.error("Error loading chats:", err);
//       }
//     },
//     [hasMore, setUserChat, token]
//   );

//   useEffect(() => {
//     if (token) {
//       loadChats(1);
//     }
//   }, [loadChats, token]);

//   useEffect(() => {
//     if (page > 1 && token) {
//       loadChats(page);
//     }
//   }, [loadChats, page, token]);

//   const handleScroll = (e) => {
//     const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
//     if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   return (
//     <div className="w-full sm:w-80 md:w-96 lg:w-[450px] bg-white border-r shadow-sm flex flex-col h-screen max-w-full overflow-hidden relative">
//       {/* Search Screen */}
//       <div
//         className={`absolute inset-0 bg-white flex flex-col transition-transform duration-300 ease-in-out z-20 ${
//           searchOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <SearchUsers onBack={() => setSearchOpen(false)} />
//       </div>

//       {/* Main Chat List */}
//       <div
//         className={`flex flex-col flex-1 transition-transform duration-300 ease-in-out ${
//           searchOpen ? "-translate-x-full" : "translate-x-0"
//         }`}
//       >
//         <Header setSearchOpen={setSearchOpen} />

//         {/* Search Bar */}
//         <div className="p-2 sm:p-3">
//           <input
//             type="text"
//             placeholder="Search or start new chat"
//             className="w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-300 focus:border-green-500 text-xs sm:text-sm md:text-base focus:outline-none bg-[#f6f5f4]"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white overflow-x-auto">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-2 sm:px-3 md:px-4 py-1 rounded-full border text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
//                 activeTab === tab
//                   ? "bg-green-200 text-black border-green-400"
//                   : "bg-white text-gray-600 border-gray-300 hover:bg-yellow-50"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Chat List */}
//         <div
//           className="overflow-y-auto flex-1 max-h-[calc(100vh-180px)]"
//           onScroll={handleScroll}
//         >
//           {filteredChats.length === 0 ? (
//             <div className="flex items-center justify-center h-full text-gray-500 text-xs sm:text-sm">
//               No chats found
//             </div>
//           ) : (
//             <ul>
//               {filteredChats.map((item, index) => {
//                 const isChat = Array.isArray(item.users);
//                 const isGroup = isChat && item.is_group;

//                 let displayName, avatar, chatData, userData;

//                 if (isChat) {
//                   userData = isGroup
//                     ? null
//                     : get_sender(loggedUser, item.users);
//                   displayName = isGroup ? item.chat_name : userData?.name;
//                   avatar = isGroup
//                     ? placeholderImg
//                     : userData?.profilePic || placeholderImg;
//                   chatData = item;
//                 } else {
//                   displayName = item.name;
//                   avatar = item.profilePic || placeholderImg;
//                   chatData = null;
//                   userData = item;
//                 }

//                 const fileBaseURL =
//                   import.meta.env.VITE_API_BASE_URL || "http://localhost:5100";
//                 const avatar_url =
//                   avatar === placeholderImg
//                     ? placeholderImg
//                     : `${fileBaseURL}/uploads/user_profile/${avatar}`;

//                 return (
//                   <li
//                     key={item._id || index}
//                     className="relative p-2 sm:p-3 hover:bg-gray-100 flex items-center gap-3"
//                     onClick={() =>
//                       handleChatClick({
//                         user: userData || displayName,
//                         chat: chatData || {
//                           is_new_chat: true,
//                           user: userData,
//                         },
//                       })
//                     }
//                   >
//                     <div className="flex items-center justify-between w-full px-3 py-2 ">
//                       {/* Left section */}
//                       <div className="flex items-center gap-3 flex-1 min-w-0">
//                         <img
//                           src={avatar_url}
//                           className="w-12 h-12 rounded-full object-cover"
//                         />
//                         <div className="flex flex-col min-w-0">
//                           <span className="font-medium text-sm truncate">
//                             {displayName}
//                           </span>
//                           <span className="text-xs text-gray-500 truncate">
//                             {item.latest_msg?.attachments?.length > 0
//                               ? "file"
//                               : item.latest_msg?.msg || ""}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Right section */}
//                       <div className="flex flex-col items-end ml-2">
//                         <span className="text-[10px] text-green-500">
//                           {formatChatTime(item.latest_msg?.createdAt)}
//                         </span>
//                         {item.is_favorite && (
//                           <FaHeart className="text-red-500" />
//                         )}
//                         {item.unseenCount > 0 && (
//                           <span className="mt-1 text-[10px] sm:text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
//                             {item.unseenCount}
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Dropdown */}
//                     <MdExpandMore
//                       className="ml-auto text-base sm:text-lg md:text-xl cursor-pointer hover:text-gray-600"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDropdownClick(e, index);
//                       }}
//                     />
//                     {showMenuIndex === index && (
//                       <DropdownMenu
//                         top={menuPos.top}
//                         left={menuPos.left}
//                         isGroup={isGroup}
//                         onClose={() => setShowMenuIndex(null)}
//                       />
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// Sidebar.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "./Header";
import { fetch_chat } from "../services/chatService";
import placeholderImg from "../assets/placeholder.png";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { MdExpandMore } from "react-icons/md";
import DropdownMenu from "./DropDownMenu";
import { get_sender } from "../config/ChatLogic";
import SearchUsers from "./SearchUsers";
import { formatChatTime } from "../utils/dateUtils";
import { FaHeart } from "react-icons/fa";
import { useUserChat } from "../context/UserChatContext";
import { useSocket } from "../context/SocketContex";
import { msg_seen_service } from "../services/messageService";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ activeTab, setActiveTab, setSearchOpen, searchOpen }) => {
  const tabs = ["All", "Unread", "Favorites", "Groups"];
  const [search, setSearch] = useState("");
  const [chatUsers, setChatUsers] = useState([]);
  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const { selectedChat, setSelectedChat } = useChat();
  const navigate = useNavigate();
  const { setUserChat } = useUserChat();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const { socket } = useSocket();
  const { user: loggedUser, token } = useAuth();
  const containerRef = useRef(null);

  // normalize id helper
  const idStr = (v) => (v === undefined || v === null ? "" : String(v));

  // ---------- SOCKET: handle incoming messages ----------
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (msg) => {
      try {
        // Normalize incoming chat id & sender id (support both shapes)
        const incomingChatId = msg?.chat?._id ?? msg?.chat;
        const senderId = msg?.sender?._id ?? msg?.sender;

        // ignore messages sent by logged in user
        if (idStr(senderId) === idStr(loggedUser?._id)) return;

        setChatUsers((prev = []) => {
          // create shallow copy for immutability
          const next = [...prev];
          const idx = next.findIndex((c) => idStr(c._id) === idStr(incomingChatId));
          const isOpen = idStr(selectedChat?._id) === idStr(incomingChatId);

          if (idx === -1) {
            // Not found -> create a minimal chat item and add to top
            const newChat = {
              _id: incomingChatId,
              latest_msg: msg,
              unseenCount: isOpen ? 0 : 1,
              is_group: !!msg.chat?.is_group,
              chat_name: msg.chat?.chat_name || null,
              users: msg.chat?.users || [],
              // add other fields if your UI expects them
            };
            return [newChat, ...next];
          }

          // update existing chat immutably
          const existing = next[idx];
          const updated = {
            ...existing,
            latest_msg: msg,
            unseenCount: isOpen ? 0 : ((existing.unseenCount || 0) + 1),
          };

          // remove old position and move to top
          next.splice(idx, 1);
          next.unshift(updated);
          return next;
        });

        // update shared userChat context if available
        try {
          setUserChat((prev = []) => {
            const next = [...prev];
            const idx2 = next.findIndex((c) => idStr(c._id) === idStr(msg?.chat?._id ?? msg?.chat));
            const isOpen = idStr(selectedChat?._id) === idStr(msg?.chat?._id ?? msg?.chat);
            if (idx2 === -1) {
              return [{ _id: incomingChatId, latest_msg: msg, unseenCount: isOpen ? 0 : 1 }, ...next];
            }
            const updated = { ...next[idx2], latest_msg: msg, unseenCount: isOpen ? 0 : ((next[idx2].unseenCount || 0) + 1) };
            next.splice(idx2, 1);
            next.unshift(updated);
            return next;
          });
        } catch (e) {
          // non-fatal if setUserChat not present
        }
      } catch (err) {
        console.error("Error handling newMessage in sidebar:", err);
      }
    };

    socket.on("messageReceive", onNewMessage);
    return () => socket.off("messageReceive", onNewMessage);
  }, [socket, loggedUser, selectedChat, setUserChat]);

  // ---------- Close dropdown when clicking outside ----------
  useEffect(() => {
    const handleClickOutside = () => setShowMenuIndex(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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

  const handleChatClick = async (data) => {
    // ensure chat object exists and set selected chat
    setSelectedChat(data.chat);

    // clear unseen count locally
    setChatUsers((prev) => prev.map((c) => (idStr(c._id) === idStr(data.chat._id) ? { ...c, unseenCount: 0 } : c)));

    // inform server that messages were seen (pass token if your API requires)
    if (token) {
      try {
        const formdata = new FormData();
        formdata.append("chat_id", data.chat._id);
        await msg_seen_service(formdata, token);
      } catch (err) {
        console.warn("msg_seen_service failed:", err);
      }
    }

    // navigate to chat route (pass user/chat in state for ChatRoom)
    navigate("/chat", { state: { user: data.user, chat: data.chat } });
  };

  // ---------- FILTER / SEARCH ----------
  const filteredChats = useMemo(() => {
    const base = chatUsers.filter((c) => {
      if (!search) return true;
      const name = c.chat_name ?? (Array.isArray(c.users) ? get_sender(loggedUser, c.users)?.name : c.name);
      return String(name || "").toLowerCase().includes(search.toLowerCase());
    });

    switch (activeTab) {
      case "Unread":
        return base.filter((c) => (c.unseenCount || 0) > 0);
      case "Favorites":
        return base.filter((c) => c.is_favorite);
      case "Groups":
        return base.filter((c) => c.is_group);
      default:
        return base;
    }
  }, [chatUsers, search, activeTab, loggedUser]);

  // ---------- LOAD CHATS (pagination) ----------
  const loadChats = useCallback(
    async (newPage = 1) => {
      if (!token) {
        setHasMore(false);
        return;
      }
      try {
        const res = await fetch_chat(newPage, limit, token);
        const data = res?.data ?? [];
        if (data.length) {
          setHasMore(data.length === limit);
          if (newPage === 1) {
            setChatUsers(data);
            setUserChat(data);
          } else {
            setChatUsers((prev) => [...prev, ...data]);
            setUserChat((prev) => [...(prev || []), ...data]);
          }
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error loading chats:", err);
        setHasMore(false);
      }
    },
    [limit, setUserChat, token]
  );

  useEffect(() => {
    if (token) loadChats(1);
    // reset page when token changes
    setPage(1);
  }, [loadChats, token]);

  useEffect(() => {
    if (page > 1) loadChats(page);
  }, [page, loadChats]);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore) {
      setPage((p) => p + 1);
    }
  };

  // ---------- render ----------
  return (
    <div className="w-full sm:w-80 md:w-96 lg:w-[450px] bg-white border-r shadow-sm flex flex-col h-screen max-w-full overflow-hidden relative">
      {/* Search overlay */}
      <div className={`absolute inset-0 bg-white flex flex-col transition-transform duration-300 ease-in-out z-20 ${searchOpen ? "translate-x-0" : "translate-x-full"}`}>
        <SearchUsers onBack={() => setSearchOpen(false)} />
      </div>

      {/* Main list */}
      <div className={`flex flex-col flex-1 transition-transform duration-300 ease-in-out ${searchOpen ? "-translate-x-full" : "translate-x-0"}`}>
        <Header setSearchOpen={setSearchOpen} />

        <div className="p-2 sm:p-3">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-300 focus:border-green-500 text-xs sm:text-sm md:text-base focus:outline-none bg-[#f6f5f4]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 sm:px-3 md:px-4 py-1 rounded-full border text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab ? "bg-green-200 text-black border-green-400" : "bg-white text-gray-600 border-gray-300 hover:bg-yellow-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div ref={containerRef} className="overflow-y-auto flex-1 max-h-[calc(100vh-180px)]" onScroll={handleScroll}>
          {filteredChats.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-xs sm:text-sm">No chats found</div>
          ) : (
            <ul>
              {filteredChats.map((item, index) => {
                const isChat = Array.isArray(item.users);
                const isGroup = isChat && item.is_group;

                let displayName, avatar, chatData, userData;
                if (isChat) {
                  userData = isGroup ? null : get_sender(loggedUser, item.users);
                  displayName = isGroup ? item.chat_name : userData?.name;
                  avatar = isGroup ? placeholderImg : userData?.profilePic || placeholderImg;
                  chatData = item;
                } else {
                  displayName = item.name;
                  avatar = item.profilePic || placeholderImg;
                  chatData = null;
                  userData = item;
                }

                const fileBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5100";
                const avatar_url = avatar === placeholderImg ? placeholderImg : `${fileBaseURL}/uploads/user_profile/${avatar}`;

                return (
                  <li key={item._id || index} className="relative p-2 sm:p-3 hover:bg-gray-100 flex items-center gap-3" onClick={() => handleChatClick({ user: userData || displayName, chat: chatData || { is_new_chat: true, user: userData } })}>
                    <div className="flex items-center justify-between w-full px-3 py-2 ">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img src={avatar_url} className="w-12 h-12 rounded-full object-cover" alt="avatar" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-sm truncate">{displayName}</span>
                          <span className="text-xs text-gray-500 truncate">{item.latest_msg?.attachments?.length > 0 ? "file" : item.latest_msg?.msg || ""}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end ml-2">
                        <span className="text-[10px] text-green-500">{formatChatTime(item.latest_msg?.createdAt)}</span>
                        {item.is_favorite && <FaHeart className="text-red-500" />}
                        {item.unseenCount > 0 && <span className="mt-1 text-[10px] sm:text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">{item.unseenCount}</span>}
                      </div>
                    </div>

                    <MdExpandMore
                      className="ml-auto text-base sm:text-lg md:text-xl cursor-pointer hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDropdownClick(e, index);
                      }}
                    />
                    {showMenuIndex === index && <DropdownMenu top={menuPos.top} left={menuPos.left} isGroup={isGroup} onClose={() => setShowMenuIndex(null)} />}
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
