// import React, { useEffect, useState } from "react";
// import { FaPaperPlane } from "react-icons/fa";
// import { useChat } from "../context/SelectedUserContext";
// import { useNavigate } from "react-router-dom";
// import placeholderImg from "../assets/placeholder.png";
// import {
//   create_chat_service,
//   get_Message_SelectedUser_services,
//   msg_delete_me_service,
//   msg_seen_service,
// } from "../services/messageService";
// import Cookies from "js-cookie";
// import { MdArrowDropDown } from "react-icons/md";
// import { useRef } from "react";
// import {
//   MdInfoOutline,
//   MdReply,
//   MdContentCopy,
//   MdEmojiEmotions,
//   MdForward,
//   MdPushPin,
//   MdStarBorder,
//   MdDeleteOutline,
//   MdExpandMore,
// } from "react-icons/md";
// import ModalDelete from "../components/ModalDelete";

// const ChatRoom = () => {
//   const [message, setMessage] = useState("");
//   const { selectedUser, setSelectedUser } = useChat();
//   const [messages, setMessages] = useState([]);
//   const [showMenu, setShowMenu] = useState("");
//   const navigate = useNavigate();
//   const [showDropdownId, setShowDropdownId] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdownId(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//   useEffect(() => {
//     if (!selectedUser) {
//       navigate("/");
//     } else {
//       const selected_user_msg = async () => {
//         let formdata = new FormData();
//         let login_id = Cookies.get("token");
//         formdata.append("login_id", login_id);
//         formdata.append("id", selectedUser._id);
//         const response = await get_Message_SelectedUser_services(formdata);
//         setMessages(response.data.messages);
//         await msg_seen_service(formdata);
//       };
//       selected_user_msg();
//     }
//   }, [selectedUser]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") {
//         setSelectedUser(null);
//         navigate("/");
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   });

//   useEffect(() => {
//     const messageContainer = document.querySelector("#message-container");
//     messageContainer?.scrollTo({
//       top: messageContainer.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!message.trim()) return;
//     const formdata = new FormData();
//     let sender_id = Cookies.get("token");
//     formdata.append("sender_id", sender_id);
//     formdata.append("receiver_id", selectedUser?._id);
//     formdata.append("msg", message);
//     const chat = await create_chat_service(formdata);
//     if (chat.status === 200) {
//       const newMsg = {
//         msg: message,
//         sender_id: sender_id,
//         createdAt: new Date().toISOString(),
//       };
//       setMessages((prev) => [...prev, newMsg]);
//       setMessage("");
//     }
//   };

//   const handleDelete = () => {
//     setShowModal(true);
//   };

//   const deleteForEveryone = () => {
//     console.log("Deleted for everyone");
//     setShowModal(false);
//   };
//   const deleteForMe = async () => {
//     const formdata = new FormData();
//     let login_id = Cookies.get("token");

//     formdata.append("id", selectedUser._id);
//     formdata.append("msg_id", msgId);
//     formdata.append("login_id", login_id);
//     console.log("Deleted for me only");
//     const res = await msg_delete_me_service(formdata);
//     if (res.status === 200) {
//       console.log("msg deleted");
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen w-full">
//       {/* Header */}
//       <div className="bg-white p-1 flex items-center justify-between border-b shadow-sm">
//         <div className="flex items-center gap-4">
//           <img
//             src={selectedUser?.profilePic || placeholderImg}
//             alt="Profile"
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <span className="font-semibold text-lg">
//             {selectedUser?.name || selectedUser?.senderName}
//           </span>
//         </div>
//         <div className="relative">
//           <button
//             onClick={() => setShowMenu((prev) => !prev)}
//             className="text-gray-600 hover:text-black focus:outline-none"
//           >
//             ⋮
//           </button>
//           {showMenu && (
//             <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10 text-sm">
//               <li
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => alert("Show Contact Info")}
//               >
//                 Contact Info
//               </li>
//               <li
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => alert("Select Messages")}
//               >
//                 Select Messages
//               </li>
//               <li
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => alert("Added to Favorite")}
//               >
//                 Add to Favorite
//               </li>
//               <li
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => {
//                   setSelectedUser(null);
//                   navigate("/");
//                 }}
//               >
//                 Close Chat
//               </li>
//             </ul>
//           )}
//         </div>
//       </div>

//       {/* Chat messages */}
//       <div
//         id="message-container"
//         className="flex-1 overflow-y-auto p-4 bg-gray-50"
//         style={{ minHeight: 0 }}
//       >
//         {Array.isArray(messages) &&
//           messages.map((value, idx) => {
//             const isSender = value.sender_id !== selectedUser._id;
//             const msgId = value._id;

//             return (
//               <div
//                 key={idx}
//                 className={`relative group flex flex-col max-w-xs md:max-w-md lg:max-w-lg mb-2 px-2 py-1 rounded-xl ${
//                   isSender
//                     ? "bg-green-200 self-end ml-auto text-black"
//                     : "bg-white self-start text-black"
//                 }`}
//               >
//                 {/* Message Text */}
//                 <div>{value.msg}</div>

//                 {/* Time & Arrow Row */}
//                 <div className="flex items-center justify-end mt-1 relative">
//                   <span className="text-xs text-gray-500 mr-1">
//                     {new Date(value.createdAt).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </span>

//                   {/* ▼ Arrow shown only on hover */}
//                   <button
//                     onClick={() =>
//                       setShowDropdownId((prev) =>
//                         prev === msgId ? null : msgId
//                       )
//                     }
//                     className="hidden group-hover:inline-block text-gray-600 hover:text-gray-800 focus:outline-none"
//                   >
//                     <MdExpandMore size={20} />
//                   </button>

//                   {/* Dropdown Menu */}
//                   {showDropdownId === msgId && (
//                     <ul
//                       ref={dropdownRef}
//                       className="absolute right-0 top-6 w-44 bg-white border rounded-md shadow-lg text-sm z-30"
//                     >
//                       <li
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => alert("Message Info")}
//                       >
//                         <MdInfoOutline /> Message Info
//                       </li>
//                       <li
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => alert("Reply")}
//                       >
//                         <MdReply /> Reply
//                       </li>
//                       <li
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => navigator.clipboard.writeText(value.msg)}
//                       >
//                         <MdContentCopy /> Copy
//                       </li>
//                       <li
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => alert("React")}
//                       >
//                         <MdEmojiEmotions /> React
//                       </li>
//                       <li
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => alert("Forward")}
//                       >
//                         <MdForward /> Forward
//                       </li>
//                       <li
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => alert("Pin")}
//                       >
//                         <MdPushPin /> Pin
//                       </li>
//                       <li
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => alert("Star")}
//                       >
//                         <MdStarBorder /> Star
//                       </li>
//                       <li className="border-t my-1" />
//                       <li
//                         className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer"
//                         onClick={handleDelete}
//                       >
//                         <MdDeleteOutline /> Delete
//                         <ModalDelete
//                           isOpen={showModal}
//                           onClose={() => setShowModal(false)}
//                           onDeleteForEveryone={deleteForEveryone}
//                           onDeleteForMe={deleteForMe}
//                           msgId={msgId}
//                         />
//                       </li>
//                     </ul>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//       </div>

//       {/* Message Input Section */}
//       <div className="p-4 mb-5">
//         <div className="flex items-center gap-2 bg-white rounded-full shadow px-4 py-2">
//           {/* Emoji / Plus Icon */}
//           <button className="text-gray-500 hover:text-gray-700">
//             <span className="text-xl">➕</span>
//           </button>

//           {/* Input Field */}
//           <input
//             type="text"
//             placeholder="Type a message"
//             className="flex-1 focus:outline-none text-gray-800 px-2"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           />

//           {/* Microphone Icon */}
//           {/* <button className="text-gray-500 hover:text-gray-700">🎤</button> */}

//           {/* Send Button */}
//           <button
//             onClick={sendMessage}
//             className="text-blue-600 hover:text-blue-800 ml-2"
//           >
//             <FaPaperPlane size={20} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;

import React, { useEffect, useState, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useChat } from "../context/SelectedUserContext";
import { useNavigate } from "react-router-dom";
import placeholderImg from "../assets/placeholder.png";
import {
  create_chat_service,
  get_Message_SelectedUser_services,
  msg_delete_me_service,
  msg_seen_service,
} from "../services/messageService";
import Cookies from "js-cookie";
import {
  MdArrowDropDown,
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

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const { selectedUser, setSelectedUser } = useChat();
  const [messages, setMessages] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdownId, setShowDropdownId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      navigate("/");
    } else {
      const fetchMessages = async () => {
        const formdata = new FormData();
        formdata.append("login_id", Cookies.get("token"));
        formdata.append("id", selectedUser._id);
        const response = await get_Message_SelectedUser_services(formdata);
        setMessages(response.data.messages);
        await msg_seen_service(formdata);
      };
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    const messageContainer = document.querySelector("#message-container");
    messageContainer?.scrollTo({
      top: messageContainer.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedUser(null);
        navigate("/");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });
  const sendMessage = async () => {
    if (!message.trim()) return;
    const formdata = new FormData();
    const sender_id = Cookies.get("token");
    formdata.append("sender_id", sender_id);
    formdata.append("receiver_id", selectedUser?._id);
    formdata.append("msg", message);
    const chat = await create_chat_service(formdata);
    if (chat.status === 200) {
      const newMsg = {
        msg: message,
        sender_id,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setMessage("");
    }
  };

  const handleDeleteClick = (msgId) => {
    setSelectedMsgId(msgId);
    setShowModal(true);
  };

  const deleteForMe = async () => {
    const formdata = new FormData();
    formdata.append("login_id", Cookies.get("token"));
    formdata.append("msg_id", selectedMsgId);
    formdata.append("id", selectedUser._id);
    const res = await msg_delete_me_service(formdata);
    if (res.status === 200) {
      setMessages((prev) => prev.filter((msg) => msg._id !== selectedMsgId));
      setShowModal(false);
    }
  };

  const deleteForEveryone = () => {
    // Your logic here
    alert("Deleted for everyone");
    setShowModal(false);
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <div className="bg-white p-2 flex justify-between items-center border-b shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={selectedUser?.profilePic || placeholderImg}
            className="w-10 h-10 rounded-full"
          />
          <span className="text-lg font-semibold">
            {selectedUser?.name || selectedUser?.senderName}
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-xl"
          >
            ⋮
          </button>
          {showMenu && (
            <ul className="absolute right-0 mt-2 w-48 bg-white border shadow-md rounded text-sm z-10">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => alert("Contact Info")}
              >
                Contact Info
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => alert("Select Messages")}
              >
                Select Messages
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => alert("Add to Favorite")}
              >
                Add to Favorite
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedUser(null);
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
        id="message-container"
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
      >
        {Array.isArray(messages) &&
          messages.map((msg, idx) => {
            const isSender = msg.sender_id !== selectedUser._id;
            return (
              <div
                key={idx}
                className={`relative group max-w-xs md:max-w-md mb-2 p-2 rounded-xl ${
                  isSender
                    ? "bg-green-200 self-end ml-auto"
                    : "bg-white self-start"
                }`}
              >
                <div>{msg.msg}</div>
                <div className="flex items-center justify-end text-xs text-gray-500 mt-1 relative">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  <button
                    onClick={() =>
                      setShowDropdownId((prev) =>
                        prev === msg._id ? null : msg._id
                      )
                    }
                    className="hidden group-hover:inline-block ml-1"
                  >
                    <MdExpandMore size={18} />
                  </button>

                  {showDropdownId === msg._id && (
                    <ul
                      ref={dropdownRef}
                      className="absolute right-0 top-6 w-44 bg-white border rounded-md shadow-lg text-sm z-30"
                    >
                      <li
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => alert("Info")}
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
          })}
      </div>

      {/* Input */}
      <div className="p-4">
        <div className="flex items-center gap-2 bg-white rounded-full shadow px-4 py-2">
          <span className="text-xl text-gray-500">➕</span>
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 focus:outline-none text-gray-800 px-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="text-blue-600 hover:text-blue-800 ml-2"
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      <ModalDelete
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDeleteForEveryone={deleteForEveryone}
        deleteForMe={deleteForMe}
        msgId={selectedMsgId}
      />
    </div>
  );
};

export default ChatRoom;
