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

const DropDownMenu = ({ top, left, onClose, isGroup }) => {
  return ReactDOM.createPortal(
    <div
      className="absolute w-44 sm:w-56 bg-white shadow-lg rounded-lg z-[9999] max-w-[90vw]"
      style={{ top, left }}
    >
      <ul className="py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700">
        <li className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 cursor-pointer">
          <MdArchive className="mr-2 text-base sm:text-lg" />
          Archive chat
        </li>
        <li className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 cursor-pointer">
          <MdNotificationsOff className="mr-2 text-base sm:text-lg" />
          Mute notifications
        </li>
        <li className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 cursor-pointer">
          <MdPushPin className="mr-2 text-base sm:text-lg" />
          Pin chat
        </li>
        <li className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 cursor-pointer">
          <MdMarkChatRead className="mr-2 text-base sm:text-lg" />
          Mark as read
        </li>
        <li className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 cursor-pointer">
          <MdFavoriteBorder className="mr-2 text-base sm:text-lg" />
          Add to favourites
        </li>
        <hr className="my-0.5 sm:my-1" />
        <li className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 cursor-pointer text-red-600">
          <MdExitToApp className="mr-2 text-base sm:text-lg" />
          {isGroup ? "Exit group" : "Delete Chat"}
        </li>
      </ul>
    </div>,
    document.body
  );
};

export default DropDownMenu;
