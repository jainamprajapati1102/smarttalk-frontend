// import React, { useState, useRef, useEffect } from "react";
// import {
//   HiOutlineDocument,
//   HiOutlinePhotograph,
//   HiOutlineCamera,
//   //   HiOutlineHeadphone,
//   HiOutlineUser,
//   HiOutlineChartBar,
//   HiOutlineCalendar,
//   HiOutlinePlusCircle,
//   HiPlus,
//   HiX,
// } from "react-icons/hi";
// import { FaHeadphones } from "react-icons/fa"; // ✅ Works
// import { FaPaperPlane } from "react-icons/fa";
// import FilePreviewModal from "../components/FilePrviewModal";
// const ChatInput = ({ sendMessage, message, setMessage }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const menuRef = useRef(null);
//   const [file, setFile] = useState(null);
//   const [fileType, setFileType] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const fileInputRef = useRef(null);
//   const imageInputRef = useRef(null);
//   const audioInputRef = useRef(null);

//   //   const handleFileUpload = (e, type) => {
//   //     const file = e.target.files[0];
//   //     if (!file) return;

//   //     const typeMap = {
//   //       Document: "document",
//   //       "Photos & Videos": file.type.startsWith("image") ? "image" : "video",
//   //       Audio: "audio",
//   //     };

//   //     setPreviewFile(file);
//   //     setPreviewType(typeMap[type]);
//   //     setShowPreview(true);
//   //   };

//   const handleFileUpload = (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;

//     setFile(selected);
//     const type = selected.type.startsWith("image") ? "image" : "other";
//     setFileType(type);
//     setShowModal(true);
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setIsMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative p-4 mb-5">
//       {/* Hidden Inputs */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         className="hidden"
//         onChange={(e) => handleFileUpload(e, "Document")}
//       />
//       <input
//         type="file"
//         accept="image/*,video/*"
//         ref={imageInputRef}
//         className="hidden"
//         onChange={(e) => handleFileUpload(e, "Photos & Videos")}
//       />
//       <input
//         type="file"
//         accept="audio/*"
//         ref={audioInputRef}
//         className="hidden"
//         onChange={(e) => handleFileUpload(e, "Audio")}
//       />

//       {/* Floating Menu */}
//       {isMenuOpen && (
//         <div
//           ref={menuRef}
//           className="absolute bottom-16 left-4 bg-white rounded-2xl shadow-lg py-3 w-60 z-50"
//         >
//           <ul className="text-sm font-medium text-gray-700">
//             {[
//               {
//                 label: "Document",
//                 icon: <HiOutlineDocument />,
//                 action: () => fileInputRef.current.click(),
//               },
//               {
//                 label: "Photos & videos",
//                 icon: <HiOutlinePhotograph />,
//                 action: () => imageInputRef.current.click(),
//               },
//               { label: "Camera", icon: <HiOutlineCamera /> },
//               {
//                 label: "Audio",
//                 icon: <FaHeadphones />,
//                 action: () => audioInputRef.current.click(),
//               },
//               { label: "Contact", icon: <HiOutlineUser /> },
//               { label: "Poll", icon: <HiOutlineChartBar /> },
//               { label: "Event", icon: <HiOutlineCalendar /> },
//               { label: "New sticker", icon: <HiOutlinePlusCircle /> },
//             ].map((item, i) => (
//               <li
//                 key={i}
//                 className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 hover:text-blue-600 cursor-pointer transition rounded-md"
//                 onClick={item.action}
//               >
//                 <span className="text-lg">{item.icon}</span>
//                 {item.label}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Chat Input */}
//       <div className="flex items-center gap-2 bg-white rounded-full shadow px-4 py-2">
//         <span
//           className="text-xl text-gray-500 cursor-pointer"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           {isMenuOpen ? <HiX /> : <HiPlus />}
//         </span>

//         <input
//           type="text"
//           placeholder="Type a message"
//           className="flex-1 focus:outline-none text-gray-800 px-2"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />

//         <button
//           onClick={sendMessage}
//           className="text-blue-600 hover:text-blue-800 ml-2"
//         >
//           <FaPaperPlane size={20} />
//         </button>
//       </div>
//       <FilePreviewModal
//         isOpen={showModal}
//         file={file}
//         fileType={fileType}
//         onClose={() => {
//           setShowModal(false);
//           setFile(null);
//           setFileType(null);
//         }}
//         onSend={sendMessage}
//       />
//     </div>
//   );
// };

// export default ChatInput;

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
  HiX,
} from "react-icons/hi";
import { FaHeadphones, FaPaperPlane } from "react-icons/fa";
import FilePreviewModal from "./FilePreviewModal";

const ChatInput = ({ sendMessage, message, setMessage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // Handle clicks outside the floating menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect file type and show preview modal
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
    ({ file, caption, fileType }) => {
      // Send message logic
      sendMessage({ file, caption, fileType });
    },
    [sendMessage]
  );

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
    { label: "New sticker", icon: <HiOutlinePlusCircle /> },
  ];

  return (
    <div className="relative p-4 mb-5">
      {/* Hidden File Inputs */}
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

      {/* Floating Action Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-16 left-4 bg-white rounded-2xl shadow-lg py-3 w-60 z-50"
        >
          <ul className="text-sm font-medium text-gray-700">
            {menuItems.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 hover:text-blue-600 cursor-pointer transition rounded-md"
                onClick={item.action}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-center gap-2 bg-white rounded-full shadow px-4 py-2">
        <span
          className="text-xl text-gray-500 cursor-pointer"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <HiX /> : <HiPlus />}
        </span>

        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 focus:outline-none text-gray-800 px-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage({ message })}
        />

        <button
          onClick={() => sendMessage({ message })}
          className="text-blue-600 hover:text-blue-800 ml-2"
        >
          <FaPaperPlane size={20} />
        </button>
      </div>

      {/* File Preview Modal */}
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
