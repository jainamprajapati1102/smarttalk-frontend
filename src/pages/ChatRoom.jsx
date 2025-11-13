// ChatRoom.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
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
import MessageItem from "../components/MessageItem";

const ChatRoom = () => {
  const { selectedChat, setSelectedChat } = useChat();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  const loggedUser = useRef(JSON.parse(localStorage.getItem("loggedin")));
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [skip, setSkip] = useState(0);
  const skipRef = useRef(0);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [isTypingOther, setIsTypingOther] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [showDropdownId, setShowDropdownId] = useState(null);

  const messageContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const sameId = (a, b) => String(a) === String(b);

  const getMsgChatId = (msg) => msg?.chat?._id ?? msg?.chat;

  useEffect(() => {
    if (!socket || !selectedChat?._id) return;

    socket.emit("joinChat", selectedChat._id);

    const handleTyping = ({ chatId, userId }) => {
      if (
        sameId(chatId, selectedChat._id) &&
        !sameId(userId, loggedUser.current?._id)
      ) {
        setIsTypingOther(true);
      }
    };

    const handleStopTyping = ({ chatId, userId }) => {
      if (
        sameId(chatId, selectedChat._id) &&
        !sameId(userId, loggedUser.current?._id)
      ) {
        setIsTypingOther(false);
      }
    };

    const handleNewMessage = (msg) => {
      const msgChatId = getMsgChatId(msg);
      if (!sameId(msgChatId, selectedChat._id)) {
        return;
      }
      setMessages((prev) => {
        if (prev.some((m) => sameId(m._id, msg._id))) return prev;
        const next = [...prev, msg];

        requestAnimationFrame(() => {
          const container = messageContainerRef.current;
          if (container) container.scrollTop = container.scrollHeight;
        });
        return next;
      });
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("newMessage", handleNewMessage);

      try {
        socket.emit("leaveChat", selectedChat._id);
      } catch (e) {
        //  console.error("Error leaving chat:", e);
      }
    };
  }, [socket, selectedChat]);

  const fetchMessages = useCallback(
    async ({ append = false, prepend = false, forSkip = 0 } = {}) => {
      if (!selectedChat?._id) return;
      try {
        const response = await get_Message_SelectedUser_services(
          selectedChat._id,
          {
            skip: forSkip,
            limit,
          }
        );
        const newMessages = response.data.messages || [];

        const newMessagesOrdered = newMessages;

        if (!newMessagesOrdered.length) {
          if (!prepend) {
            setMessages([]);
          }

          setHasMore(false);
          return;
        }

        if (newMessagesOrdered.length < limit) {
          setHasMore(false);
        }

        if (prepend) {
          const container = messageContainerRef.current;
          const prevHeight = container?.scrollHeight || 0;

          setMessages((prev) => {
            const prevIds = new Set(prev.map((m) => String(m._id)));
            const uniqueNew = newMessagesOrdered.filter(
              (m) => !prevIds.has(String(m._id))
            );

            return [...uniqueNew, ...prev];
          });

          requestAnimationFrame(() => {
            const newHeight = container?.scrollHeight || 0;
            if (container) container.scrollTop = newHeight - prevHeight;
          });
        } else if (append) {
          setMessages((prev) => {
            const prevIds = new Set(prev.map((m) => String(m._id)));
            const unique = newMessagesOrdered.filter(
              (m) => !prevIds.has(String(m._id))
            );
            const next = [...prev, ...unique];
            requestAnimationFrame(() => {
              const container = messageContainerRef.current;
              if (container) container.scrollTop = container.scrollHeight;
            });
            return next;
          });
        } else {
          const sorted = [...newMessagesOrdered].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          setMessages(sorted);
          requestAnimationFrame(() => {
            const container = messageContainerRef.current;
            if (container) container.scrollTop = container.scrollHeight;
          });
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    },
    [selectedChat?._id, limit]
  );

  useEffect(() => {
    if (!selectedChat?._id) {
      navigate("/");
      return;
    }
    setMessages([]);
    setSkip(0);
    skipRef.current = 0;
    setHasMore(true);
    fetchMessages({ forSkip: 0 });
  }, [selectedChat, fetchMessages, navigate]);

  useEffect(() => {
    if (!selectedChat?._id) return;
    const markSeen = async () => {
      try {
        const formdata = new FormData();
        formdata.append("chat_id", selectedChat._id);
        await msg_seen_service(formdata);
      } catch (e) {
        console.error("msg seen error:", e);
      }
    };
    markSeen();
  }, [selectedChat]);

  const handleScroll = useCallback(() => {
    const container = messageContainerRef.current;
    if (!container || !hasMore) return;

    if (container.scrollTop <= 20 && hasMore) {
      const nextSkip = skipRef.current + limit;
      setSkip(nextSkip);
      skipRef.current = nextSkip;
      fetchMessages({ prepend: true, forSkip: nextSkip });
    }
  }, [fetchMessages, hasMore, limit]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleTyping = () => {
    if (!socket || !selectedChat?._id) return;
    socket.emit("typing", {
      chatId: selectedChat._id,
      userId: loggedUser.current?._id,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        chatId: selectedChat._id,
        userId: loggedUser.current?._id,
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
        setMessages((prev) =>
          prev.filter((msg) => !sameId(msg._id, selectedMsgId))
        );
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
        setMessages((prev) =>
          prev.filter((msg) => !sameId(msg._id, selectedMsgId))
        );
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error deleting message for everyone:", error);
    }
  };

  const groupMessagesByDate = (msgs) => {
    const sorted = [...msgs].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    return sorted.reduce((groups, msg) => {
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
          onClick={() => setShowMenu((p) => !p)}
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
                isSender={sameId(
                  msg.sender_id?._id ?? msg.sender_id,
                  loggedUser.current?._id
                )}
                selectedChat={selectedChat}
                handleDeleteClick={handleDeleteClick}
                setShowDropdownId={setShowDropdownId}
                showDropdownId={showDropdownId}
                dropdownRef={null}
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
