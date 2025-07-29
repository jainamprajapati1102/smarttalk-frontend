// components/DropdownMenu.jsx
import React from "react";
import ReactDOM from "react-dom";
import {
  MdArchive,
  MdNotificationsOff,
  MdPushPin,
  MdMarkChatRead,
  MdFavoriteBorder,
  MdExitToApp,
} from "react-icons/md";

const DropdownMenu = ({ top, left, onClose }) => {
  return ReactDOM.createPortal(
    <div
      className="absolute w-56 bg-white shadow-lg rounded-lg z-[9999]"
      style={{ top, left }}
    >
      <ul className="py-2 text-sm text-gray-700">
        <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <MdArchive className="mr-2" />
          Archive chat
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <MdNotificationsOff className="mr-2" />
          Mute notifications
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <MdPushPin className="mr-2" />
          Pin chat
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <MdMarkChatRead className="mr-2" />
          Mark as read
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <MdFavoriteBorder className="mr-2" />
          Add to favourites
        </li>
        <hr className="my-1" />
        <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
          <MdExitToApp className="mr-2" />
          Exit group
        </li>
      </ul>
    </div>,
    document.body
  );
};

export default DropdownMenu;
