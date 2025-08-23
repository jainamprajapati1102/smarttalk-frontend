// ChatInput.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  HiOutlineDocument,
  HiOutlinePhotograph,
  HiOutlineCamera,
  HiOutlineUser,
  HiOutlineChartBar,
  HiOutlineCalendar,
  HiOutlinePlusCircle,
  HiPlus,
  HiOutlineEmojiHappy,
  HiX,
} from "react-icons/hi";
import { FaHeadphones, FaPaperPlane } from "react-icons/fa";
import FilePreviewModal from "./FilePreviewModal";
import cookie from "js-cookie";
import { create_message_service } from "../services/messageService";
import { ChatEventEnum } from "../constant";
import { useSocket } from "../context/SocketContex";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
const ChatInput = ({
  message,
  setMessage,
  sendMessage,
  selectedChat,
  setMessages,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { socket, socketConnected } = useSocket();
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const loggedUser = JSON.parse(localStorage.getItem("loggedin"));
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileUpload = useCallback((e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const type = selected.type.startsWith("image")
      ? "image"
      : selected.type.startsWith("video")
      ? "video"
      : selected.type.startsWith("audio")
      ? "audio"
      : "document";

    setFile(selected);
    setFileType(type);
    setShowModal(true);
  }, []);

  const handleSendFile = useCallback(
    async ({ file, caption, fileType }) => {
      try {
        const formdata = new FormData();
        const sender_id = cookie.get("token");
        formdata.append("chatId", selectedChat?._id);
        formdata.append("msg", caption || "");
        formdata.append("attachments", file);

        const chat = await create_message_service(formdata);
        if (chat.status === 201) {
          const messageData = {
            msg: message,
            chatId: selectedChat._id,
            attachments: chat.data.message.attachments,
            createdAt: chat.data.message.createdAt,
          };
          setMessages((prev) => [...prev, messageData]);
          if (socket && socket.connected) {
            socket.emit("newMessage", messageData);
          } else {
            console.warn("Socket not connected yet — message not sent.");
          }
          setMessage("");
        } else {
          throw new Error("Failed to send file");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to send file");
      }
    },
    [message, selectedChat, setMessage, setMessages, socket]
  );

  const handleSendText = useCallback(async () => {
    if (!message.trim() || !selectedChat?._id) return;

    try {
      const formdata = new FormData();
      const chatId = selectedChat?._id;
      formdata.append("msg", message);
      formdata.append("chatId", chatId);

      const chat = await create_message_service(formdata);
      if (chat.status === 201) {
        const messageData = {
          _id: chat.data.message._id,
          msg: message,
          chat: selectedChat,
          sender_id: loggedUser._id,
          createdAt: chat.data.message.createdAt,
        };
        if (socket && socket.connected) {
          socket.emit("newMessage", messageData);
          setMessages((prev) => [...prev, messageData]);
        } else {
          console.warn("Socket not connected yet — message not sent.");
        }
        setMessage("");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  }, [message, selectedChat, loggedUser._id, setMessages, socket, setMessage]);

  useEffect(() => {
    if (!socket) return;

    socket.on("messageReceive", (newMessage) => {
      console.log("new msg", newMessage);

      if (newMessage.chat._id !== selectedChat?._id) {
        // message for another chat → maybe show notification instead
        return;
      }

      setMessages((prev) => {
        if (prev.some((m) => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    });

    return () => {
      socket.off("messageReceive");
    };
  }, [socket, selectedChat, setMessages]);
  const menuItems = [
    {
      label: "Document",
      icon: <HiOutlineDocument />,
      action: () => fileInputRef.current.click(),
    },
    {
      label: "Photos & videos",
      icon: <HiOutlinePhotograph />,
      action: () => imageInputRef.current.click(),
    },
    {
      label: "Camera",
      icon: <HiOutlineCamera />,
      action: () => alert("Camera access not implemented."),
    },
    {
      label: "Audio",
      icon: <FaHeadphones />,
      action: () => audioInputRef.current.click(),
    },
    { label: "Contact", icon: <HiOutlineUser /> },
    { label: "Poll", icon: <HiOutlineChartBar /> },
    { label: "Event", icon: <HiOutlineCalendar /> },
    // { label: "New sticker", icon: <HiOutlinePlusCircle /> },
  ];

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    setIsEmojiOpen(false);
    inputRef.current?.focus();
  };
  return (
    <div className="relative p-2 sm:p-3 md:p-4 mb-4 sm:mb-5">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
      />
      <input
        type="file"
        accept="image/*,video/*"
        ref={imageInputRef}
        className="hidden"
        onChange={handleFileUpload}
      />
      <input
        type="file"
        accept="audio/*"
        ref={audioInputRef}
        className="hidden"
        onChange={handleFileUpload}
      />

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-14 sm:bottom-16 left-2 sm:left-4 bg-white rounded-2xl shadow-lg py-2 sm:py-3 w-48 sm:w-60 z-50"
        >
          <ul className="text-xs sm:text-sm font-medium text-gray-700">
            {menuItems.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 hover:text-blue-600 cursor-pointer transition rounded-md"
                onClick={item.action}
              >
                <span className="text-base sm:text-lg">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-full shadow px-2 sm:px-3 md:px-4 py-1.5 sm:py-2">
        <span
          className="text-lg sm:text-xl text-gray-500 cursor-pointer"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <HiX /> : <HiPlus />}
        </span>
        <span
          className="text-lg sm:text-xl text-gray-500 cursor-pointer"
          // onClick={() => console.log("open emoji picker here")}
          onClick={() => setIsEmojiOpen((prev) => !prev)}
        >
          <HiOutlineEmojiHappy />
        </span>
        {isEmojiOpen && (
          <div className="absolute bottom-12 left-10 z-50">
            <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
          </div>
        )}
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 focus:outline-none text-gray-800 text-sm sm:text-base px-1 sm:px-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendText()}
        />

        <button
          onClick={handleSendText}
          className="text-blue-600 hover:text-blue-800 ml-1 sm:ml-2"
        >
          <FaPaperPlane size={12} className="sm:size-6" />
        </button>
      </div>

      <FilePreviewModal
        file={file}
        fileType={fileType}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setFile(null);
          setFileType(null);
        }}
        onSend={handleSendFile}
      />
    </div>
  );
};

export default ChatInput;
