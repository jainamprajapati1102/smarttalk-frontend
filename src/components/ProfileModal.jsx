import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import placeholderImg from "../assets/placeholder.png";
import { useAuth } from "../context/AuthContext";

const ProfileModal = ({ onBack }) => {
  const { user } = useAuth();
  const fileBaseURL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5100";
  const avtar_url =
    user.profilePic === placeholderImg
      ? placeholderImg
      : `${fileBaseURL}/uploads/user_profile/${user.profilePic}`;
  return (
    <div className="w-full sm:w-80 md:w-96 lg:w-[450px] bg-white border-r shadow-sm flex flex-col h-screen max-w-full overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-gray-50">
        <button onClick={onBack} className="text-gray-600 hover:text-black">
          <IoMdArrowBack size={22} />
        </button>
        <h2 className="text-lg font-semibold">Profile</h2>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center mt-6 px-4">
        {/* Profile Picture with Hover Overlay */}
        <div className="relative group">
          <img
            src={avtar_url}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border shadow"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-xs font-medium">
              Change profile photo
            </span>
          </div>
        </div>

        {/* Name */}
        <div className="w-full mt-6">
          <label className="text-xs text-green-600 font-medium">Name</label>
          <div className="flex items-center justify-between border-b border-gray-300 py-2">
            <span className="text-base font-medium">{user.name}</span>
            <MdEdit className="text-gray-500 cursor-pointer hover:text-black" />
          </div>
        </div>

        {/* About */}
        <div className="w-full mt-4">
          <label className="text-xs text-green-600 font-medium">About</label>
          <div className="flex items-center justify-between border-b border-gray-300 py-2">
            <span className="text-sm text-gray-600">{user?.about ?? "Not updated yet"}</span>
            <MdEdit className="text-gray-500 cursor-pointer hover:text-black" />
          </div>
        </div>

        {/* Phone */}
        <div className="w-full mt-4">
          <label className="text-xs text-green-600 font-medium">Phone</label>
          <div className="flex items-center gap-2 py-2">
            <span className="text-gray-700 font-medium">
              📞 +91 {user.mobile}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
