import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import LeftBar from "../components/LeftBar";
import ProfileModal from "../components/ProfileModal";
const MainLayout = () => {
  const [searchOpen, setSearchOpen] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  return (
    <div className="flex flex-row w-full h-screen ">
      <LeftBar setShowProfile={setShowProfile} />
      {showProfile ? (
        <ProfileModal onBack={() => setShowProfile(false)} />
      ) : (
        <Sidebar
          setSearchOpen={setSearchOpen}
          searchOpen={searchOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1  p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
