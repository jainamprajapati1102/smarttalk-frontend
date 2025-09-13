// ChatRoom.jsx
import React, { useEffect, useState, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { useLocation, useNavigate } from "react-router-dom";
import placeholderImg from "../assets/placeholder.png";
import {
  get_Message_SelectedUser_services,
  msg_delete_me_service,
  msg_seen_service,
  msg_delete_everyone_service,
} from "../services/messageService";
import ModalDelete from "../components/ModalDelete";
import ChatInput from "../components/ChatInput";
import { formatMessageDate } from "../utils/dateUtils";
import { useSocket } from "../context/SocketContex";
import { useAuth } from "../context/AuthContext";
import MessageItem from "../components/MessageItem";

const ChatRoom = () => {
  const { selectedChat, setSelectedChat } = useChat();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [messages, setMessages] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState("");
  const [isTypingOther, setIsTypingOther] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [showDropdownId, setShowDropdownId] = useState(null);

  const loggedUser = JSON.parse(localStorage.getItem("loggedin"));
  const messageContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ================= SOCKET EVENTS =================

  useEffect(() => {
    if (!socket || !selectedChat?._id) return;

    socket.emit("joinChat", selectedChat._id);

    socket.on("typing", ({ chatId, userId }) => {
      if (chatId === selectedChat._id && userId !== loggedUser._id) {
        setIsTypingOther(true);
      }
    });

    socket.on("stopTyping", ({ chatId, userId }) => {
      if (chatId === selectedChat._id && userId !== loggedUser._id) {
        setIsTypingOther(false);
      }
    });

    socket.on("newMessage", (msg) => {
      if (msg.chat._id === selectedChat._id) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("newMessage");
    };
  }, [socket, selectedChat, loggedUser?._id]);

  // ================= FETCH MESSAGES =================

  const fetchMessages = async ({ append = false, prepend = false } = {}) => {
    try {
      const response = await get_Message_SelectedUser_services(
        selectedChat._id,
        { skip, limit }
      );

      const newMessages = response.data.messages || [];

      // If no new messages, stop further fetching
      if (newMessages.length === 0) {
        setHasMore(false);
        return;
      }

      if (newMessages.length < limit) {
        setHasMore(false);
      }

      if (prepend) {
        const container = messageContainerRef.current;
        const prevHeight = container.scrollHeight;

        // prevent duplicates
        setMessages((prev) => {
          const prevIds = new Set(prev.map((m) => m._id));
          const unique = newMessages.filter((m) => !prevIds.has(m._id));
          return [...unique, ...prev];
        });

        setTimeout(() => {
          const newHeight = container.scrollHeight;
          container.scrollTop = newHeight - prevHeight;
        }, 0);
      } else if (append) {
        setMessages((prev) => {
          const prevIds = new Set(prev.map((m) => m._id));
          const unique = newMessages.filter((m) => !prevIds.has(m._id));
          return [...prev, ...unique];
        });
      } else {
        setMessages(newMessages);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (!selectedChat?._id) {
      navigate("/");
      return;
    }
    setSkip(0);
    setHasMore(true);
    fetchMessages();
  }, [selectedChat]);

  // ================= MESSAGE SEEN =================

  useEffect(() => {
    if (!selectedChat?._id) return;
    const markSeen = async () => {
      const formdata = new FormData();
      formdata.append("chat_id", selectedChat._id);
      await msg_seen_service(formdata);
    };
    markSeen();
  }, [selectedChat]);

  // ================= SCROLL HANDLER =================

  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (!container || !hasMore) return;

    if (container.scrollTop === 0 && hasMore) {
      setSkip((prev) => prev + limit);
      fetchMessages({ prepend: true });
    }
  };

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, skip, limit]);

  // ================= HELPERS =================

  const scrollToBottom = () => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  };

  const handleTyping = () => {
    if (!socket) return;
    socket.emit("typing", { chatId: selectedChat._id, userId: loggedUser._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        chatId: selectedChat._id,
        userId: loggedUser._id,
      });
    }, 2000);
  };

  const handleDeleteClick = (msgId) => {
    setSelectedMsgId(msgId);
    setShowModal(true);
  };

  const deleteForMe = async () => {
    try {
      const formdata = new FormData();
      formdata.append("msg_id", selectedMsgId);
      formdata.append("chat_id", selectedChat._id);
      const res = await msg_delete_me_service(formdata);
      if (res.status === 200) {
        setMessages((prev) => prev.filter((msg) => msg._id !== selectedMsgId));
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const deleteForEveryone = async () => {
    try {
      const formdata = new FormData();
      formdata.append("msg_id", selectedMsgId);
      formdata.append("chat_id", selectedChat._id);
      const res = await msg_delete_everyone_service(formdata);
      if (res.status === 200) {
        setMessages((prev) => prev.filter((msg) => msg._id !== selectedMsgId));
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error deleting message for everyone:", error);
    }
  };

  const groupMessagesByDate = (msgs) => {
    return msgs.reduce((groups, msg) => {
      const date = formatMessageDate(msg.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
      return groups;
    }, {});
  };

  useEffect(() => {
    if (!selectedChat?._id) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedChat(null);
        navigate("/");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, selectedChat, setSelectedChat]);
  // ================= RENDER =================

  return (
    <div className="flex flex-col h-screen w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white p-3 flex justify-between items-center border-b shadow-sm">
        <div className="flex items-center gap-2">
          <img
            src={selectedChat?.profilePic || placeholderImg}
            className="w-10 h-10 rounded-full object-cover"
            alt="User profile"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold truncate max-w-[200px]">
              {selectedChat?.is_group ? selectedChat?.chat_name : user?.name}
            </span>
            {isTypingOther && (
              <span className="text-sm text-gray-500">Typing...</span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="text-xl"
          aria-label="Open chat options"
        >
          ⋮
        </button>
        {showMenu && (
          <ul className="absolute right-4 mt-10 w-48 bg-white border shadow-md rounded text-sm z-10">
            <li className="px-4 py-2 hover:bg-gray-100">Contact Info</li>
            <li className="px-4 py-2 hover:bg-gray-100">Select Messages</li>
            <li className="px-4 py-2 hover:bg-gray-100">Add to Favorite</li>
            <li
              className="px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setSelectedChat(null);
                navigate("/");
              }}
            >
              Close Chat
            </li>
          </ul>
        )}
      </div>

      {/* Messages */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
      >
        {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
          <div key={date}>
            <div className="text-center text-gray-500 text-sm my-3">{date}</div>
            {msgs.map((msg) => (
              <MessageItem
                key={msg._id}
                msg={msg}
                isSender={msg.sender_id?._id === loggedUser._id}
                selectedChat={selectedChat}
                handleDeleteClick={handleDeleteClick}
                setShowDropdownId={setShowDropdownId}
                showDropdownId={showDropdownId}
                dropdownRef={dropdownRef}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4">
        <ChatInput
          message={message}
          setMessage={setMessage}
          selectedChat={selectedChat}
          handleTyping={handleTyping}
          setMessages={setMessages}
        />
      </div>

      <ModalDelete
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDeleteForEveryone={deleteForEveryone}
        onDeleteForMe={deleteForMe}
        msgId={selectedMsgId}
        chatId={selectedChat}
      />
    </div>
  );
};

export default ChatRoom;
