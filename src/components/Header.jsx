import React, { useState, useRef, useEffect } from "react";
import { logoutUser } from "../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import {
  FaUserFriends,
  FaStar,
  FaCheckSquare,
  FaSignOutAlt,
} from "react-icons/fa";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";

const Header = ({ setSearchOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { setSelectedChat } = useChat();
  const menuRef = useRef(null); // for dropdown
  const buttonRef = useRef(null); // for 3-dot button

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await logoutUser(token);
      if (res.status === 200) {
        localStorage.removeItem("token");
        toast.success(res.msg || "Logged out successfully");
        setUser(null);
        setSelectedChat(null);
        navigate("/login");
      }
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
    }
  };

  const handleOpenSearch = () => {
    setSearchOpen(true);
  };

  return (
    <div className="flex justify-between items-center text-gray-600 p-1 sm:p-2">
      {/* Left side: Title */}
      <h2 className="text-base sm:text-lg font-semibold text-green-600 truncate">
        SmartTalks
      </h2>

      {/* Right side: Add icon and 3-dot menu */}
      <div className="flex items-center gap-1 sm:gap-2 relative">
        <button
          className="text-black hover:text-green-600 text-lg sm:text-[22px]"
          onClick={handleOpenSearch}
        >
          <GroupAddOutlinedIcon
            style={{ fontSize: "20px", sm: { fontSize: "24px" } }}
          />
        </button>

        <button
          ref={buttonRef}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-xl sm:text-2xl px-1 sm:px-2 rounded"
        >
          ⋮
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-8 sm:top-10 w-44 sm:w-56 max-w-[90vw] p-1.5 sm:p-2 bg-white text-black rounded-2xl shadow-lg z-50"
          >
            <button className="w-full flex items-center gap-2 sm:gap-3 text-left px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 text-xs sm:text-sm">
              <FaUserFriends className="text-base sm:text-lg" /> New group
            </button>
            <button className="w-full flex items-center gap-2 sm:gap-3 text-left px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 text-xs sm:text-sm">
              <FaStar className="text-base sm:text-lg" /> Starred messages
            </button>
            <button className="w-full flex items-center gap-2 sm:gap-3 text-left px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-100 text-xs sm:text-sm">
              <FaCheckSquare className="text-base sm:text-lg" /> Select chats
            </button>

            <div className="border-t my-1 sm:my-2"></div>

            <button
              className="w-full flex items-center gap-2 sm:gap-3 text-left px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm hover:text-red-800 hover:bg-red-100 text-xs sm:text-sm"
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
            >
              <FaSignOutAlt className="text-base sm:text-lg" /> Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
