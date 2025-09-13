import React from "react";
import placeholderImg from "../assets/placeholder.png";
import { Link } from "react-router-dom";

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
const MessageItem = ({
  msg,
  isSender,
  selectedChat,
  onDelete,
  dropdownRef,
  setShowDropdownId,
  showDropdownId,
  handleDeleteClick,
}) => {
  const attachment = msg.attachment?.[0] || null;

  // Bubble style
  const bubbleClass = isSender
    ? "bg-blue-500 text-white rounded-lg p-2 sm:p-3 ml-auto"
    : "bg-gray-200 text-black rounded-lg p-2 sm:p-3";

  return (
    <div
      key={msg._id}
      className={`mb-3 flex items-start ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      {/* ✅ Profile pic (only for group + not sender) */}
      {selectedChat?.is_group && !isSender && (
        <img
          src={msg.sender_id?.profilePic || placeholderImg}
          alt={msg.sender_id?.name || "User"}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-2"
        />
      )}

      {/* Message bubble */}
      <div
        className={`group ${bubbleClass} relative`}
        style={{ maxWidth: "70%" }}
      >
        {/* ✅ Sender name (group chat only, not sender) */}
        {selectedChat?.is_group && !isSender && (
          <span className="text-xs font-semibold text-green-700 mb-1 block">
            {msg.sender_id?.name || "Unknown"}
          </span>
        )}

        {/* Text message */}
        {msg.msg && (
          <div className="break-words text-sm sm:text-base">{msg.msg}</div>
        )}

        {/* Attachments */}
        {attachment && (
          <div className="mt-2">
            {attachment.type.startsWith("image/") ? (
              <img
                src={attachment.url}
                alt="attachment"
                className="rounded-lg max-w-xs sm:max-w-sm"
              />
            ) : attachment.type.startsWith("audio/") ? (
              <audio controls src={attachment.url} className="w-full mt-2" />
            ) : (
              <Link
                to={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {attachment.name || "Download file"}
              </Link>
            )}
          </div>
        )}

        {/* Footer → Time + Seen */}
        <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {msg.seen && <span className="ml-1">✔️</span>}
        </div>

        {/* Optional: Dropdown for delete/edit */}
        <button
          onClick={() =>
            setShowDropdownId((prev) => (prev === msg._id ? null : msg._id))
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
            className="absolute right-0 top-6 w-36 sm:w-44 bg-white border rounded-md shadow-lg text-xs text-black sm:text-sm z-30"
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
              onClick={() => navigator.clipboard.writeText(msg.msg)}
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
  );
};

export default MessageItem;
