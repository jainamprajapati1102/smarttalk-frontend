import React, { useEffect, useState, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useChat } from "../context/ChatContext";
import { useLocation, useNavigate } from "react-router-dom";
import placeholderImg from "../assets/placeholder.png";
import {
  get_Message_SelectedUser_services,
  msg_delete_me_service,
  msg_seen_service,
  msg_delete_everyone_service,
} from "../services/messageService";
import {
  MdInfoOutline,
  MdReply,
  MdContentCopy,
  MdEmojiEmotions,
  MdForward,
  MdPushPin,
  MdStarBorder,
  MdDeleteOutline,
  MdExpandMore,
} from "react-icons/md";
import ModalDelete from "../components/ModalDelete";
import ChatInput from "../components/ChatInput";
import { formatMessageDate } from "../utils/dateUtils";
import { useSocket } from "../context/SocketContex";

import { getBubbleClass } from "../utils/chatStyles";
const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const { selectedChat, setSelectedChat } = useChat();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdownId, setShowDropdownId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  // const [socketConnected, setSocketConnected] = useState(false);
  // const [isConnected, setIsConnected] = useState(false);
  // const [isTyping, setIsTyping] = useState(false);
  const { state, socketConnected } = useLocation();
  // console.log("chatroom state", state);
  const user = state?.user;
  const chat = state?.chat;
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const messageContainerRef = useRef(null);
  const loggedUser = JSON.parse(localStorage.getItem("loggedin"));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  var selectChatCompare = useRef();

  // useEffect(() => {
  //   if (socket && selectedChat?._id) {
  //     socket.emit("joinChat", selectedChat._id);
  //   }
  // }, [socket, selectedChat]);

  // Fetch messages for selected user
  useEffect(() => {
    if (!selectedChat) {
      navigate("/");
      return;
    }

    const fetchMessages = async () => {
      const login_id = localStorage.getItem("token");
      if (!login_id) {
        alert("User not authenticated. Please log in.");
        navigate("/login");
        return;
      }
      try {
        const formdata = new FormData();
        formdata.append("login_id", login_id);
        formdata.append("id", selectedChat._id);
        const token = localStorage.getItem("token");
        const response = await get_Message_SelectedUser_services(
          selectedChat._id,
          token
        );
        setMessages(response.data.messages || []);
        socket.emit("joinChat", selectedChat?._id);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
    selectChatCompare = selectedChat;
  }, [navigate, selectedChat]);

  useEffect(() => {
    // const messageSeenFun=aynsc()=>{

    const messageSeenFun = async () => {
      const formdata = new FormData();
      formdata.append("chat_id", selectedChat._id);
      const response = await msg_seen_service(formdata);
      if (response.status != 200) console.log("error in msg seen api");
    };
    messageSeenFun();
  }, [selectedChat]);
  // Scroll to bottom when messages change
  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Handle Escape key to close chat
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedChat(null);
        navigate("/");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, setSelectedChat]);

  const handleDeleteClick = (msgId) => {
    setSelectedMsgId(msgId);
    setShowModal(true);
  };

  // Delete message for me
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
      alert("Failed to delete message");
    }
  };

  // Delete message for everyone
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
      // alert("Failed to delete message for everyone"); 
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, msg) => {
      const date = formatMessageDate(msg.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
      return groups;
    }, {});
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-full overflow-hidden">
      {/* Header */}
      <div
        data-userid={selectedChat?._id}
        className="bg-white p-3 sm:p-4 flex justify-between items-center border-b shadow-sm"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={selectedChat?.profilePic || placeholderImg}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            alt="User profile"
          />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-semibold truncate max-w-[150px] sm:max-w-[300px]">
              {user?.name}
            </span>
            {/* {isTyping && (
              <span className="text-xs sm:text-sm text-gray-500">
                Typing...
              </span>
            )} */}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-lg sm:text-xl"
            aria-label="Open chat options"
          >
            ⋮
          </button>
          {showMenu && (
            <ul className="absolute right-0 mt-2 w-40 sm:w-48 bg-white border shadow-md rounded text-xs sm:text-sm z-10">
              <li
                className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => alert("Contact Info")}
              >
                Contact Info
              </li>
              <li
                className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => alert("Select Messages")}
              >
                Select Messages
              </li>
              <li
                className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => alert("Add to Favorite")}
              >
                Add to Favorite saints
              </li>
              <li
                className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
      </div>

      {/* Messages */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-50"
      >
        {Object.entries(groupMessagesByDate(messages)).map(
          ([date, msgs], idx) => (
            <div key={idx}>
              {/* Date Divider */}
              <div className="text-center text-gray-500 text-xs sm:text-sm my-2 sm:my-3">
                {date}
              </div>

              {msgs.map((msg, index) => {
                // const isSender = msg.sender_id?._id === loggedUser?._id;
                const isSender =
                  (typeof msg.sender_id === "string"
                    ? msg.sender_id
                    : msg.sender_id?._id) === loggedUser?._id;
                const fileBaseURL =
                  import.meta.env.VITE_API_BASE_URL || "http://localhost:5100";

                const attachment = msg.attachments?.[0];
                let filePath = "";
                let isImage = false;
                let isAudio = false;
                let isDocument = false;

                if (attachment?.url) {
                  filePath = `${fileBaseURL}/uploads/users_${selectedChat._id}/${attachment.url}`;
                  isImage = /\.(jpe?g|png|webp|gif)$/i.test(attachment.url);
                  isAudio = /\.(mp3|wav|ogg|mp4)$/i.test(attachment.url);
                  isDocument = /\.(pdf|docx?|xlsx?)$/i.test(attachment.url);
                }

                const containerClass = `relative group mb-2 sm:mb-3 flex ${
                  isSender ? "justify-end" : "justify-start"
                }`;

                // const bubbleClass = isImage
                //   ? "rounded-lg overflow-hidden"
                //   : `rounded-xl p-2 sm:p-3 ${
                //       isSender ? "bg-green-200 text-right" : "bg-white text-left"
                //     } max-w-[70%] sm:max-w-[60%] md:max-w-[50%] shadow`;
                const bubbleClass = getBubbleClass(isSender, isImage);
                return (
                  <div
                    key={msg.createdAt || `temp-${index}`}
                    className={containerClass}
                  >
                    <div className={`group ${bubbleClass}`}>
                      {/* Text Message */}
                      {msg.msg && (
                        <div className="break-words text-sm sm:text-base">
                          {msg.msg}
                        </div>
                      )}

                      {/* Attachments */}
                      {attachment && (
                        <div className="mt-1 sm:mt-2">
                          {isImage ? (
                            <img
                              src={filePath}
                              alt="Sent attachment"
                              className="max-w-[200px] max-h-[300px] object-contain"
                            />
                          ) : isAudio ? (
                            <audio
                              controls
                              className="w-40 sm:w-48 mt-1"
                              onError={() => alert("Audio file not found")}
                            >
                              <source src={filePath} type="audio/ogg" />
                              Your browser does not support the audio tag.
                            </audio>
                          ) : isDocument ? (
                            <a
                              href={filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:underline"
                            >
                              📄 {attachment.url}
                            </a>
                          ) : (
                            <a
                              href={filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-xs sm:text-sm"
                            >
                              Download File
                            </a>
                          )}
                        </div>
                      )}

                      {/* Time + Seen + Dropdown */}
                      <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {msg.seen && <span className="ml-1">✔️</span>}

                        {/* Dropdown Button */}
                        <button
                          onClick={() =>
                            setShowDropdownId((prev) =>
                              prev === msg._id ? null : msg._id
                            )
                          }
                          className="hidden group-hover:inline-block text-gray-600 hover:text-gray-800 ml-2"
                          aria-label="Message options"
                        >
                          <MdExpandMore size={16} className="sm:size-6" />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdownId === msg._id && (
                          <ul
                            ref={dropdownRef}
                            className="absolute right-0 top-6 w-36 sm:w-44 bg-white border rounded-md shadow-lg text-xs sm:text-sm z-30"
                          >
                            <li
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => alert("Message Info")}
                            >
                              <MdInfoOutline /> Message Info
                            </li>
                            <li
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => alert("Reply")}
                            >
                              <MdReply /> Reply
                            </li>
                            <li
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() =>
                                navigator.clipboard.writeText(msg.msg)
                              }
                            >
                              <MdContentCopy /> Copy
                            </li>
                            <li
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => alert("React")}
                            >
                              <MdEmojiEmotions /> React
                            </li>
                            <li
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => alert("Forward")}
                            >
                              <MdForward /> Forward
                            </li>
                            <li
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => alert("Pin")}
                            >
                              <MdPushPin /> Pin
                            </li>
                            <li
                              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => alert("Star")}
                            >
                              <MdStarBorder /> Star
                            </li>
                            <li className="border-t my-1" />
                            <li
                              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer"
                              onClick={() => handleDeleteClick(msg._id)}
                            >
                              <MdDeleteOutline /> Delete
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      <div className="p-2 sm:p-4">
        <ChatInput
          message={message}
          setMessage={setMessage}
          // sendMessage={sendMessage}
          selectedChat={selectedChat}
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
