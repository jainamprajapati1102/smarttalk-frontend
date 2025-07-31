import React, { useState, useRef, useEffect } from "react";
import { logoutUser } from "../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/SelectedUserContext";
import {
  FaUserFriends,
  FaStar,
  FaCheckSquare,
  FaSignOutAlt,
} from "react-icons/fa";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { setSelectedUser } = useChat();
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
      const res = await logoutUser();
      if (res.status === 200) {
        toast.success(res.msg || "Logged out successfully");
        setUser(null);
        setSelectedUser(null);
        navigate("/login");
      }
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-between items-center text-gray-600 p-1">
      {/* Left side: Title */}
      <h2 className="text-lg font-semibold text-green-600">SmartTalks</h2>

      {/* Right side: Add icon and 3-dot menu */}
      <div className="flex items-center gap-2 relative">
        <button className="text-black hover:text-green-600 text-[22px]">
          <GroupAddOutlinedIcon style={{ fontSize: "24px" }} />
        </button>

        <button
          ref={buttonRef}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-2xl px-2 rounded"
        >
          ⋮
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-10 w-56 p-2 bg-white text-black rounded-2xl shadow-lg z-50"
          >
            <button className="w-full flex items-center gap-3 text-left px-4 py-2 hover:bg-gray-100">
              <FaUserFriends /> New group
            </button>
            <button className="w-full flex items-center gap-3 text-left px-4 py-2 hover:bg-gray-100">
              <FaStar /> Starred messages
            </button>
            <button className="w-full flex items-center gap-3 text-left px-4 py-2 hover:bg-gray-100">
              <FaCheckSquare /> Select chats
            </button>

            <div className="border-t my-2"></div>

            <button
              className="w-full flex items-center gap-3 text-left px-4 py-2 rounded-sm hover:text-red-800 hover:bg-red-100"
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
            >
              <FaSignOutAlt /> Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
