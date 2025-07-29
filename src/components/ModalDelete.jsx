import React, { useRef, useEffect } from "react";
import { msg_delete_me_service } from "../services/messageService";
import { useChat } from "../context/SelectedUserContext";
import Cookies from "js-cookie";

const ModalDelete = ({
  isOpen,
  onClose,
  onDeleteForEveryone,
  deleteForMe,
  msgId,
}) => {
  const modalRef = useRef();

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
      >
        <p className="text-lg font-medium mb-6">Delete message?</p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onDeleteForEveryone}
            className="bg-[#E7FCEF] hover:bg-[#d5f5e9] text-green-700 font-semibold py-2 rounded-full"
          >
            Delete for everyone
          </button>
          <button
            data-id={msgId}
            onClick={deleteForMe}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-full"
          >
            Delete for me
          </button>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-600 font-semibold py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
