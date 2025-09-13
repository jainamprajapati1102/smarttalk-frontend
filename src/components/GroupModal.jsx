import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import placeholderImg from "../assets/placeholder.png";
import { search_user } from "../services/userService";
import { createGroupChatService } from "../services/chatService";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";

const GroupModal = ({ onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [groupResults, setGroupResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { setSelectedChat } = useChat();
  const navigate = useNavigate();

  // 🔎 Debounced search inside modal
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!groupSearch.trim()) {
        setGroupResults([]);
        return;
      }
      try {
        const formdata = new FormData();
        formdata.append("mobile", groupSearch);
        const response = await search_user(formdata);
        setGroupResults(response?.data || []);
      } catch (err) {
        console.error("Group search error:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [groupSearch]);

  // ➕ toggle add/remove user
  const toggleUserSelection = (user) => {
    const alreadyAdded = selectedUsers.find((u) => u._id === user._id);
    if (alreadyAdded) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userId));
  };

  // 🟢 Create group
  const createGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
      alert("Group name and members are required!");
      return;
    }
    try {
      const formdata = new FormData();
      formdata.append("chat_name", groupName);
      formdata.append("users", JSON.stringify(selectedUsers.map((u) => u._id)));

      const res = await createGroupChatService(formdata);
      if (res.status === 200) {
        setSelectedChat(res.data);
        navigate("chat", { state: { chat: res.data } });
      }

      // reset
      setGroupName("");
      setSelectedUsers([]);
      onClose();
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Create Group</h2>
          <button onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>

        {/* Group Name */}
        <input
          type="text"
          placeholder="Enter group name"
          className="w-full px-3 py-2 mb-3 rounded border border-gray-300 focus:border-green-500 focus:outline-none"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {/* Selected Users */}
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full"
            >
              <img
                src={user?.profilePic || placeholderImg}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm">{user.name}</span>
              <button
                onClick={() => removeUser(user._id)}
                className="text-red-500"
              >
                <MdClose size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Search Users */}
        <input
          type="text"
          placeholder="Search users"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:border-green-500 focus:outline-none"
          value={groupSearch}
          onChange={(e) => setGroupSearch(e.target.value)}
        />

        {/* Results */}
        <div className="max-h-40 overflow-auto mb-3">
          {groupResults.length > 0 ? (
            groupResults.map((user) => (
              <div
                key={user._id}
                className="p-2 flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => toggleUserSelection(user)}
              >
                <img
                  src={user?.profilePic || placeholderImg}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{user.name}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center">No users found</p>
          )}
        </div>

        {/* Create Button */}
        <button
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          onClick={createGroup}
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default GroupModal;
